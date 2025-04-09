import NextAuth, { type NextAuthOptions, type User as NextAuthUser } from 'next-auth'; // Import User type
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma'; // Corrected import: named export
import bcrypt from 'bcryptjs'; // Corrected import: use bcryptjs

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" }, // Changed from email to username
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Check if username and password are provided
        if (!credentials?.username || !credentials?.password) {
          console.error("Missing username or password");
          return null;
        }

        // Find user by username, explicitly selecting needed fields
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: { // Explicitly select fields
            id: true,
            username: true, // Ensure username is selected
            name: true,
            email: true,
            password: true, // Needed for comparison
            image: true,
            role: true,
          }
        });

        // Check if user exists and has a password set
        if (!user || !user.password) {
          console.error("No user found with this username or user has no password set.");
          // Optionally: Add logic here for users created via OAuth providers if they try password login
          return null;
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          // Use a more specific error message for invalid password
          console.error("Invalid password for username:", credentials.username);
          return null; // Invalid password
        }

        // If password is valid, log success and return user object
        console.log("Authorization successful for username:", user.username);
        // Return necessary user fields for JWT/Session population
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role, // Include role from Prisma User model
        } as NextAuthUser; // Assert as NextAuthUser or a compatible type
      }
    })
    // ...add more providers here if needed (e.g., Google, GitHub)
  ],
  session: {
    strategy: 'jwt', // Using JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSessionData }) { // Add trigger and session params for update logic
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image; // Use 'picture' standard claim for image
      }

      // If the session was updated (e.g., by useSession().update() or profile update action)
      // Or just on every JWT read to keep it fresh (more robust but slightly more DB reads)
      // Let's refresh on every read for simplicity here.
      // We need the user ID from the token (usually in token.sub or token.id)
      const userId = token.id || token.sub; // Use token.id if we set it, otherwise standard token.sub

      if (userId) {
          try {
              const freshUser = await prisma.user.findUnique({
                  where: { id: userId as string },
                  select: { name: true, email: true, image: true, role: true }
              });

              if (freshUser) {
                  token.name = freshUser.name;
                  token.email = freshUser.email;
                  token.picture = freshUser.image;
                  token.role = freshUser.role;
                  // Ensure id is still present if it wasn't from initial sign in
                  if (!token.id) token.id = userId;
              } else {
                  // Handle case where user might have been deleted? Return null or original token?
                  console.warn(`User with ID ${userId} not found in DB during JWT refresh.`);
                  // Returning original token might be safer than invalidating session immediately
              }
          } catch (error) {
              console.error("Error fetching fresh user data for JWT:", error);
              // Return original token to avoid breaking session on DB error
          }
      }

      return token;
    },
    async session({ session, token }) { // User param is often redundant with JWT strategy
      // Send properties from the (potentially refreshed) token to the client session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role; // Role enum should be serializable
        // Add other fields from token to session user
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture; // Map token.picture back to session.user.image
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in', // Redirect users to custom sign-in page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for signing JWTs
  // Enable debug messages in the console if you are having problems
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

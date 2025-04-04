// This file might be used for utility functions or re-exporting options if needed,
// but the primary NextAuth configuration and handlers reside in:
// src/app/api/auth/[...nextauth]/route.ts

// You can import authOptions directly from the route file where needed:
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// For client-side sign-in/sign-out, import from 'next-auth/react':
// import { signIn, signOut, useSession } from 'next-auth/react';

// For server-side session retrieval (Server Components, Route Handlers, API routes):
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// const session = await getServerSession(authOptions);

// If you need to re-export authOptions for convenience:
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
export { authOptions };

// Note: The original code attempted to export handlers ({ GET, POST }, auth, signIn, signOut)
// in a way typical for NextAuth v5 (@auth/core), which conflicts with the v4 setup
// indicated by the [...nextauth] route structure.

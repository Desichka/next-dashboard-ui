'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import authOptions

// Define the schema for form validation using Zod
const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  name: z.string().optional(), // Optional field
  email: z.string().email('Invalid email address.').optional().or(z.literal('')), // Optional, allow empty string
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  role: z.nativeEnum(Role, { errorMap: () => ({ message: 'Invalid role selected.' }) }),
});

// Define the state structure for useFormState
export interface AddUserFormState {
  message: string | null;
  errors?: {
    username?: string[];
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    database?: string[]; // For general database errors
  };
}

export async function addUser(
  prevState: AddUserFormState,
  formData: FormData
): Promise<AddUserFormState> {
  // 1. Check if the current user is an Admin
  const session = await getServerSession(authOptions); // Use getServerSession
  if (session?.user?.role !== Role.ADMIN) {
    return {
      message: 'Unauthorized: Only admins can add users.',
      errors: { database: ['Permission denied.'] },
    };
  }

  // 2. Validate form data
  const validatedFields = UserSchema.safeParse({
    username: formData.get('username'),
    name: formData.get('name') || undefined, // Handle empty string for optional field
    email: formData.get('email') || undefined, // Handle empty string for optional field
    password: formData.get('password'),
    role: formData.get('role'),
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    console.log('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Failed to add user. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, name, email, password, role } = validatedFields.data;

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

  // 4. Insert data into the database
  try {
    // Check if username or email already exists (if email is provided)
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                // Only check email if it's provided and not an empty string
                ...(email ? [{ email: email }] : []),
            ],
        },
        select: { username: true, email: true } // Select only needed fields
    });

    if (existingUser) {
        const errors: AddUserFormState['errors'] = {};
        if (existingUser.username === username) {
            errors.username = ['Username already taken.'];
        }
        if (email && existingUser.email === email) {
            errors.email = ['Email already in use.'];
        }
        return {
            message: 'Failed to add user.',
            errors: errors,
        };
    }


    await prisma.user.create({
      data: {
        username: username,
        name: name || null, // Store null if name is empty/undefined
        email: email || null, // Store null if email is empty/undefined
        password: hashedPassword,
        role: role,
        // emailVerified can be set later if implementing email verification
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to add user.',
      errors: { database: ['An unexpected error occurred.'] },
    };
  }

  // 5. Revalidate the cache for the employees page and redirect/return success
  revalidatePath('/(dashboard)/employees'); // Adjust path as needed

  return { message: 'User added successfully!' };
}

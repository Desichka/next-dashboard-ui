'use server';

import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client'; // Use the correct Status enum
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for input validation using Zod
const AddDesignSchema = z.object({
  companyNumber: z.coerce // Coerce to number for lookup
    .number({ invalid_type_error: 'Company Number must be a number.' })
    .int({ message: 'Company Number must be an integer.' }) // Ensure integer
    .positive({ message: 'Company Number must be positive.' }),
  companyName: z.string().min(1, { message: 'Company Name is required.' }), // Add companyName
  templateName: z.string().min(1, { message: 'Template Name is required.' }),
  employeeId: z.coerce
    .number({ invalid_type_error: 'Employee ID must be a number.' })
    .int({ message: 'Employee ID must be an integer.' }) // Ensure integer
    .positive({ message: 'Employee ID must be positive.' }),
  status: z.nativeEnum(Status, { // Add status validation
    errorMap: () => ({ message: 'Invalid status selected.' }),
  }),
  partners: z.string().optional(), // Add optional partners
});

export type AddDesignFormState = {
  message: string | null;
  errors?: {
    companyNumber?: string[];
    companyName?: string[]; // Add companyName errors
    templateName?: string[];
    employeeId?: string[];
    status?: string[]; // Add status errors
    partners?: string[]; // Add partners errors
    database?: string[]; // For general database errors
  };
};

export async function addDesign(
  prevState: AddDesignFormState,
  formData: FormData
): Promise<AddDesignFormState> {
  // Validate form data
  const validatedFields = AddDesignSchema.safeParse({
    companyNumber: formData.get('companyNumber'),
    companyName: formData.get('companyName'), // Get companyName
    templateName: formData.get('templateName'),
    employeeId: formData.get('employeeId'),
    status: formData.get('status'), // Get status
    partners: formData.get('partners'), // Get partners
  });

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Destructure all validated fields
  const { companyNumber, companyName, templateName, employeeId, status, partners } = validatedFields.data;

  try {
    // 1. Upsert Company: Find by ID (companyNumber) or create if not found
    const company = await prisma.company.upsert({
      where: { id: companyNumber },
      update: {
        // Optionally update name if found? For now, we only update if creating.
        // name: companyName, // Uncomment if you want to update name of existing company
      },
      create: {
        id: companyNumber, // Use the provided number as the ID for the new company
        name: companyName, // Use the provided name for the new company
      },
    });

    // 2. Check if Employee exists (no change here)
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return {
        message: 'Employee not found.',
        errors: { employeeId: ['No employee found with this ID.'] },
      };
    }

    // 3. Create the new design with all fields
    await prisma.design.create({
      data: {
        companyId: company.id, // Use the upserted company's ID
        templateName: templateName,
        status: status, // Use the status from the form
        employeeId: employeeId,
        partners: partners || null, // Use partners from form, or null if empty/not provided
      },
    });

    // Revalidate the designs list page cache
    revalidatePath('/list/designs');

    return { message: 'Design added successfully!' };

  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to add design.',
      errors: { database: ['An unexpected error occurred.'] },
    };
  }
}

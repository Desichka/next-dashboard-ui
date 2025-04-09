import { prisma } from './prisma';
import { ITEMS_PER_PAGE } from './constants';
import { Prisma } from '@prisma/client'; // Revert import

// Function to fetch companies with search and pagination
export async function fetchCompanys({
  query,
  currentPage,
  itemsPerPage = ITEMS_PER_PAGE,
}: {
  query?: string;
  currentPage?: number;
  itemsPerPage?: number;
}) {
  const offset = ((currentPage || 1) - 1) * itemsPerPage;

  try {
    let whereCondition = {};
    if (query) {
      const numericQuery = parseInt(query, 10); // Try parsing query as a number
      const isNumeric = !isNaN(numericQuery);

      whereCondition = {
        OR: [
          {
            name: {
              contains: query,
              // mode: Prisma.QueryMode.insensitive, // Temporarily remove to bypass persistent TS error
            },
          },
          // Only include ID search if the query is a valid number
          ...(isNumeric ? [{ id: numericQuery }] : []),
        ],
      };
    }

    const companys = await prisma.company.findMany({
      where: whereCondition,
      orderBy: {
        name: 'asc', // Default sort by name
      },
      skip: offset,
      take: itemsPerPage,
    });

    const count = await prisma.company.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(count / itemsPerPage);

    return { companys, totalPages, totalItems: count };
  } catch (error) {
    console.error('Database Error:', error);
    // Consider throwing a more specific error or returning a default state
    // For now, re-throwing the original error
    throw new Error('Failed to fetch companies.');
  }
}

// Function to fetch ALL companies (e.g., for dropdowns)
export async function fetchAllCompanies() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return companies;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all companies.');
  }
}

// Function to fetch active admin-defined checklist items
export async function fetchActiveChecklistItems() {
  try {
    const checklistItems = await prisma.checklistItem.findMany({
      where: {
        isActive: true, // Only fetch active items
      },
      orderBy: {
        id: 'asc', // Or order by text, etc.
      },
    });
    return checklistItems;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch active checklist items.');
  }
}

// Function to fetch a single design by its ID, including checklist items
export async function getDesignById(id: number) {
  try {
    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        company: true, // Include company details
        checklistItems: { // Include the associated checklist items
          include: {
            checklistItem: true, // Include the original admin checklist item text if linked
            user: true, // Include user who last modified/checked the item
          },
          orderBy: {
            // Optional: Define an order, e.g., admin items first, then custom, then by creation
            checklistItemId: 'asc', // Puts items linked to ChecklistItem first (non-null IDs)
            // createdAt: 'asc', // Then order by creation time
          }
        },
        // Include other relations if needed
      },
    });
    return design; // Returns the design object or null if not found
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch design by ID.');
  }
}

// Function to search designs by template name or company name
export async function searchDesigns(term: string) {
  if (!term || term.trim().length < 2) { // Basic validation
    return [];
  }

  const searchTerm = term.trim();

  try {
    const designs = await prisma.design.findMany({
      where: {
        OR: [
          {
            templateName: {
              contains: searchTerm,
              // Add mode: QueryMode.insensitive here if the TS error gets resolved later
            },
          },
          {
            company: {
              name: {
                contains: searchTerm,
                // Add mode: QueryMode.insensitive here if the TS error gets resolved later
              },
            },
          },
          // Add other searchable fields if needed (e.g., partners)
        ],
      },
      include: {
        company: { // Include company name for display in search results
          select: { name: true },
        },
      },
      take: 10, // Limit the number of search results
      orderBy: {
        updatedAt: 'desc', // Order by most recently updated
      },
    });
    return designs;
  } catch (error) {
    console.error('Database Error searching designs:', error);
    throw new Error('Failed to search designs.');
  }
}

// Function to fetch all users (for assignment dropdown)
export async function fetchAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { // Select only necessary fields for the dropdown
        id: true,
        name: true,
        username: true,
      },
      orderBy: {
        name: 'asc', // Order by name
      },
    });
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all users.');
  }
}


// Add other data fetching functions here as needed, e.g., fetchDesigns, fetchEmployees etc.

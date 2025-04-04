import { prisma } from './prisma';
import { ITEMS_PER_PAGE } from './constants';
import { Prisma } from '@prisma/client';

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
              mode: Prisma.QueryMode.insensitive,
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

// Add other data fetching functions here as needed, e.g., fetchDesigns, fetchEmployees, etc.

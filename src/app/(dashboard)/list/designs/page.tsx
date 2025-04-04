import { prisma } from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { Prisma, Company, Design, Employee } from '@prisma/client';
import DesignsClientPage from './DesignsClientPage'; // Import the client component

// Re-define the DesignList type here or import from a shared types file
type DesignList = Design & { company: Company; employee: Employee | null };

// Define the expected searchParams structure for clarity
interface DesignsPageSearchParams {
  query?: string;
  status?: string;
  employeeId?: string;
  createdStart?: string;
  createdEnd?: string;
  updatedStart?: string;
  updatedEnd?: string;
  page?: string;
  limit?: string;
}

// This is the main Server Component for the page
const DesignsPage = async ({ searchParams }: { searchParams?: DesignsPageSearchParams }) => {
  // --- Data Fetching Logic (moved from the old page) ---
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || ITEMS_PER_PAGE;

  // Get individual filter params
  const query = searchParams?.query || '';
  const statusFilter = searchParams?.status || '';
  const employeeIdFilter = searchParams?.employeeId || '';
  const createdStartFilter = searchParams?.createdStart || '';
  const createdEndFilter = searchParams?.createdEnd || '';
  const updatedStartFilter = searchParams?.updatedStart || '';
  const updatedEndFilter = searchParams?.updatedEnd || '';

  // Define the base where condition using AND logic
  const whereConditions: Prisma.DesignWhereInput[] = [];

  // Add specific filters
  if (statusFilter) {
    whereConditions.push({ status: { equals: statusFilter, mode: 'insensitive' } });
  }
  if (employeeIdFilter) {
    const employeeIdInt = parseInt(employeeIdFilter, 10);
    if (!isNaN(employeeIdInt)) {
      whereConditions.push({ employeeId: employeeIdInt });
    }
  }
  const createdAtFilter: Prisma.DateTimeFilter = {};
  if (createdStartFilter) createdAtFilter.gte = new Date(createdStartFilter);
  if (createdEndFilter) createdAtFilter.lte = new Date(createdEndFilter);
  if (Object.keys(createdAtFilter).length > 0) {
    whereConditions.push({ createdAt: createdAtFilter });
  }
  const updatedAtFilter: Prisma.DateTimeFilter = {};
  if (updatedStartFilter) updatedAtFilter.gte = new Date(updatedStartFilter);
  if (updatedEndFilter) updatedAtFilter.lte = new Date(updatedEndFilter);
  if (Object.keys(updatedAtFilter).length > 0) {
    whereConditions.push({ updatedAt: updatedAtFilter });
  }

  // Add general query filter
  if (query) {
    const queryAsInt = parseInt(query, 10);
    const isQueryInt = !isNaN(queryAsInt);
    const queryConditions: Prisma.DesignWhereInput[] = [
      { company: { name: { contains: query, mode: 'insensitive' } } },
      { status: { contains: query, mode: 'insensitive' } },
      { employee: { name: { contains: query, mode: 'insensitive' } } },
      { templateName: { contains: query, mode: 'insensitive' } },
    ];
    if (isQueryInt) {
      queryConditions.push({ companyId: queryAsInt });
    }
    whereConditions.push({ OR: queryConditions });
  }

  // Combine all conditions with AND
  const whereCondition: Prisma.DesignWhereInput = whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Fetch employees (only necessary fields)
  const employees = await prisma.employee.findMany({
    select: { id: true, name: true, surname: true },
    orderBy: { name: 'asc' },
  });

  // Fetch total count
  const totalItems = await prisma.design.count({ where: whereCondition });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch designs for the current page
  const designs = await prisma.design.findMany({
    where: whereCondition,
    include: {
      company: true,
      employee: true,
    },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    orderBy: { createdAt: 'desc' }, // Example sorting
  });
  // --- End of Data Fetching Logic ---

  // Render the Client Component, passing fetched data and searchParams as props
  return (
    <DesignsClientPage
      designs={designs as DesignList[]}
      employees={employees}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      searchParams={searchParams || {}} // Pass searchParams down
    />
  );
};

export default DesignsPage;

'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import AddCompanyModal from '@/components/AddCompanyModal'; // Import the modal
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';
import CompanyRow from './CompanyRow'; // Uncommented CompanyRow import
import { ITEMS_PER_PAGE } from '@/lib/constants';

// Company type based on Prisma schema
interface Company {
  id: number; // Changed from string to number
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields if needed for display later
}

interface CompanysClientPageProps {
  initialCompanys: Company[];
  totalPages: number;
  totalItems: number; // Added totalItems
  // Add initial filter values if needed
}

// Placeholder Row component until CompanyRow is created - No longer needed
// const PlaceholderCompanyRow = ({ item }: { item: Company }) => (
//   <tr>
//     {/* <td>{item.id}</td>  Removed ID display from placeholder */}
//     <td>{item.name}</td>
//     <td>{item.createdAt.toLocaleDateString()}</td>
//     <td>{/* Actions */}</td>
//   </tr>
// );


export default function CompanysClientPage({
  initialCompanys,
  totalPages,
  totalItems, // Added totalItems
}: CompanysClientPageProps) {
  const [companys, setCompanys] = useState<Company[]>(initialCompanys);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Add useEffect to update state when initialCompanys prop changes
  useEffect(() => {
    setCompanys(initialCompanys);
  }, [initialCompanys]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    // Note: In a real app, you'd likely re-fetch data here based on the new params
    // For now, this just updates the URL
  }, 300);

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || ITEMS_PER_PAGE;

  // TODO: Add handlers for other filters if needed

  const columns = [
    { header: 'ID', accessor: 'id' }, // Added ID column
    { header: 'Name', accessor: 'name' },
    { header: 'Created At', accessor: 'createdAt' },
    { header: 'Updated At', accessor: 'updatedAt' }, // Added Updated At column
    // Add other relevant columns
    { header: 'Actions', accessor: 'actions' },
  ];

  return (
    <> {/* Wrap in fragment to include modal */}
      <div className="bg-secondary dark:bg-secondary-dark p-5 rounded-lg mt-5">
        <div className="flex items-center justify-between mb-5">
          <TableSearch placeholder="Search for a company..." /> {/* Removed onSearch prop */}
          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 bg-lightActiveColor text-lightTextColor dark:text-darkCardBgColor rounded-md shadow hover:bg-emerald-600"
          >
            Add New Company
          </button>
        </div>
        <Table<Company>
          columns={columns}
        data={companys}
        renderRow={(company) => <CompanyRow key={company.id} item={company} />} // Using CompanyRow
        // renderRow={(company) => <PlaceholderCompanyRow key={company.id} item={company} />} // Using placeholder - Removed
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
          totalItems={totalItems} // Added totalItems
        />
      </div>
      {/* Render the modal */}
      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

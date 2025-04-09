import React from 'react';
import NewDesignClientPage from './NewDesignClientPage'; 
import { fetchAllCompanies, fetchActiveChecklistItems, fetchAllUsers } from '@/lib/data'; // Import data fetching functions

const NewDesignPage = async () => {
  // Fetch necessary data for the client component
  const companies = await fetchAllCompanies();
  const initialChecklistItems = await fetchActiveChecklistItems();
  const users = await fetchAllUsers(); // Fetch users

  return (
    <NewDesignClientPage 
      companies={companies} 
      initialChecklistItems={initialChecklistItems} 
      users={users} // Pass users as prop
    />
  );
};

export default NewDesignPage;

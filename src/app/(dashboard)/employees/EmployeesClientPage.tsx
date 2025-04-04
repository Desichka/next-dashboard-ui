'use client';

'use client';

import React, { useState } from 'react'; // Removed useTransition
import { type User as PrismaUser, Role } from '@prisma/client';
import AddUserModal from '@/components/AddUserModal'; // Import the modal
import ConfirmationModal from '@/components/ConfirmationModal'; // Import confirmation modal
import { deleteUser } from '@/app/actions/deleteUser'; // Import the delete action

// Define the type for the user data passed as props, selecting specific fields
type User = Pick<
  PrismaUser,
  'id' | 'username' | 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt'
>;

interface EmployeesClientPageProps {
  users: User[];
}

const EmployeesClientPage: React.FC<EmployeesClientPageProps> = ({ users }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  // Removed isPending and deleteError state, modal will handle it

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedUserId(null);
    setIsDeleteModalOpen(false);
  };

  const handleCreateUser = async (userData: any) => {
    // Placeholder for create user logic
    console.log('Creating user:', userData);
    // try {
    //   await createUser(userData); // Call server action
    //   closeAddModal();
    //   // Optionally: revalidate path or refresh data
    // } catch (error) {
    //   console.error('Failed to create user:', error);
    //   // Handle error display
    // }
    // This handler might not be strictly needed anymore if AddUserModal uses useFormState
    // for its submission logic and feedback. Keeping it as a placeholder.
    console.log('Creating user:', userData);
    // This handler might not be strictly needed anymore if AddUserModal uses useFormState
    // for its submission logic and feedback. Keeping it as a placeholder.
    console.log('Creating user:', userData);
    closeAddModal();
  };

  // Make the function async and return the structure expected by the modal
  const handleDeleteConfirm = async (): Promise<{ success: boolean; error?: string } | void> => {
    if (!selectedUserId) return { success: false, error: 'No user selected.' }; // Should not happen

    try {
      const result = await deleteUser(selectedUserId); // Call server action directly

      if (result.message === 'User deleted successfully.') {
        // No need to call closeDeleteModal here, modal closes itself on success
        return { success: true }; // Indicate success to the modal
      } else {
        // Extract error message from server action result
        const errorMsg = result.errors?.database?.join(', ') || result.errors?.authorization?.join(', ') || result.message || 'Failed to delete user.';
        console.error('Failed to delete user:', errorMsg);
        return { success: false, error: errorMsg }; // Return error to the modal
      }
    } catch (error) {
      console.error('Client-side error during delete:', error);
      // Return generic error for unexpected client issues
      return { success: false, error: 'An unexpected client-side error occurred.' };
    }
    // Note: We don't call closeDeleteModal() here anymore.
    // The ConfirmationModal handles closing itself based on the returned promise result.
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Manage Users
        </h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.username}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.name || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.email || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.role}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openDeleteModal(user.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label={`Delete user ${user.username}`}
                  >
                    Delete
                  </button>
                  {/* Add Edit button/logic here if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          // onSubmit is handled internally by the modal via useFormState now
        />
      )}

      {isDeleteModalOpen && selectedUserId && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete user ${users.find(u => u.id === selectedUserId)?.username ?? 'this user'}? This action cannot be undone.`}
          // Removed isPending and errorMessage props
        />
      )}
    </div>
  );
};

export default EmployeesClientPage;

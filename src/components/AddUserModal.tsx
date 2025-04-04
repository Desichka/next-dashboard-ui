'use client';

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import CustomIcon from './CustomIcon';
import { addUser, AddUserFormState } from '@/app/actions/addUser'; // Import the user action (to be created)
import { Role } from '@prisma/client'; // Import Role enum

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit prop might not be needed if using useFormState directly for submission feedback
}

// Helper component for the submit button state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      disabled={pending}
      className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Adding...' : 'Add User'}
    </button>
  );
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const initialState: AddUserFormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close modal on successful submission and reset form
    if (state.message === 'User added successfully!') {
      onClose();
      formRef.current?.reset();
    }
  }, [state.message, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4'
      onClick={handleBackdropClick}
    >
      <div
        ref={modalContentRef}
        className='bg-lightBgColor dark:bg-darkBgColor p-6 rounded-lg shadow-xl w-full max-w-md relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-lightTextColor dark:text-darkTextColor hover:text-gray-700 dark:hover:text-gray-300'
          aria-label='Close modal'
        >
          <CustomIcon name='close' className='w-5 h-5' />
        </button>
        <h2 className='text-xl font-semibold mb-4 text-lightTextColor dark:text-darkTextColor'>
          Add New User
        </h2>
        <form ref={formRef} action={dispatch}>
          {/* Display general form message/errors */}
          {state.message && !state.errors?.username && !state.errors?.password && !state.errors?.role && !state.errors?.database && (
            <p className={`mb-4 text-sm ${state.message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {state.message}
            </p>
          )}
          {state.errors?.database && (
            <p className='mb-4 text-sm text-red-600'>{state.errors.database.join(', ')}</p>
          )}

          {/* Username */}
          <div className='mb-4'>
            <label htmlFor='username' className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type='text'
              id='username'
              name='username'
              required
              aria-describedby='username-error'
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
            />
            {state.errors?.username && (
              <p id='username-error' className='mt-1 text-sm text-red-600'>
                {state.errors.username.join(', ')}
              </p>
            )}
          </div>

          {/* Name (Optional) */}
          <div className='mb-4'>
            <label htmlFor='name' className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'>
              Full Name (Optional)
            </label>
            <input
              type='text'
              id='name'
              name='name'
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
            />
             {/* No specific error message needed for optional field unless validation fails */}
          </div>

          {/* Email (Optional) */}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'>
              Email (Optional)
            </label>
            <input
              type='email'
              id='email'
              name='email'
              aria-describedby='email-error'
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
            />
            {state.errors?.email && (
              <p id='email-error' className='mt-1 text-sm text-red-600'>
                {state.errors.email.join(', ')}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'>
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type='password'
              id='password'
              name='password'
              required
              minLength={6} // Example: Enforce minimum password length
              aria-describedby='password-error'
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
            />
            {state.errors?.password && (
              <p id='password-error' className='mt-1 text-sm text-red-600'>
                {state.errors.password.join(', ')}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className='mb-4'>
            <label htmlFor='role' className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'>
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id='role'
              name='role'
              required
              defaultValue={Role.EMPLOYEE} // Default to EMPLOYEE
              aria-describedby='role-error'
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
            >
              <option value={Role.ADMIN}>Admin</option>
              <option value={Role.EMPLOYEE}>Employee</option>
            </select>
            {state.errors?.role && (
              <p id='role-error' className='mt-1 text-sm text-red-600'>
                {state.errors.role.join(', ')}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

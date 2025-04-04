'use client';

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Close modal after confirmation
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-lightBg dark:bg-darkBg p-6 rounded-lg shadow-lg w-full max-w-sm'>
        <h2 className='text-lg font-semibold mb-4 text-lightText dark:text-darkText'>{title}</h2>
        <p className='mb-6 text-lightTextSecondary dark:text-darkTextSecondary'>{message}</p>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-lightText dark:text-darkText hover:bg-gray-400 dark:hover:bg-gray-500'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className='px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

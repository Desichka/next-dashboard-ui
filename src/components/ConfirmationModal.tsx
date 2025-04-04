'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import CustomIcon from './CustomIcon'; // Assuming CustomIcon is needed for potential close button icon

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string } | void>; // Make onConfirm async and return potential error
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalContentRef = React.useRef<HTMLDivElement>(null); // Keep ref for potential outside click handling

  // Reset error when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Handle clicking outside the modal content to close (Optional but good UX)
   const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
     if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
       if (!isLoading) { // Prevent closing while loading
         onClose();
       }
     }
   };


  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      const result = await onConfirm();
      // Check if the result indicates success (action might not return anything on success)
      // Or if it returns an object with a success flag
      if (!result || (typeof result === 'object' && result.success)) {
        onClose(); // Close only on success
      } else if (typeof result === 'object' && result.error) {
        setErrorMessage(result.error); // Set error message on failure
      } else {
         // Handle cases where onConfirm doesn't return the expected structure but doesn't throw
         setErrorMessage('An unexpected issue occurred.');
      }
    } catch (error) {
      console.error("Confirmation action failed:", error);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null; // Keep this check

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
      onClick={handleBackdropClick} // Add backdrop click handler
    >
      <div
        ref={modalContentRef} // Add ref
        className='bg-lightBgColor dark:bg-darkBgColor p-6 rounded-lg shadow-lg w-full max-w-sm relative'
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click inside modal
      >
         {/* Optional: Add a close button */}
         <button
           onClick={onClose}
           disabled={isLoading}
           className='absolute top-3 right-3 text-lightTextColor dark:text-darkTextColor hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50'
           aria-label='Close modal'
         >
           <CustomIcon name='close' className='w-5 h-5' />
         </button>

        <h2 className='text-lg font-semibold mb-4 text-lightTextColor dark:text-darkTextColor'>{title}</h2>
        <p className='mb-4 text-lightTextSecondary dark:text-darkTextSecondary'>{message}</p>

        {/* Display Error Message */}
        {errorMessage && (
          // Removed background, border, and padding for a more integrated look
          <p className='mb-4 text-sm text-red-600 text-center'>
            {errorMessage}
          </p>
        )}

        <div className='flex justify-end gap-4 mt-6'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className='px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

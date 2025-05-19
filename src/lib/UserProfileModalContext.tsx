'use client';

import React, { createContext, useState, useContext } from 'react';

interface UserProfileModalContextProps {
  isModalOpen: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
}

const UserProfileModalContext = createContext<UserProfileModalContextProps | undefined>(undefined);

export const UserProfileModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <UserProfileModalContext.Provider value={{ isModalOpen, handleOpenModal, handleCloseModal }}>
      {children}
    </UserProfileModalContext.Provider>
  );
};

export const useUserProfileModal = () => {
  const context = useContext(UserProfileModalContext);
  if (!context) {
    throw new Error('useUserProfileModal must be used within a UserProfileModalProvider');
  }
  return context;
};

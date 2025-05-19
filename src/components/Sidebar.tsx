'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react'; // Import session hook
import { useUserProfileModal } from '@/lib/UserProfileModalContext'; // Import modal context
import CustomIcon from '@/components/CustomIcon';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: 'home',
        label: 'Home',
        href: '/',
        visible: ['admin', 'employee'],
      },
      {
        icon: 'employee',
        label: 'employees',
        href: '/list/employees', // Corrected path
        visible: ['admin'],
      },
      {
        icon: 'designs',
        label: 'Designs',
        href: '/list/designs',
        visible: ['admin', 'employee'],
      },
      {
        icon: 'designs', // Reusing 'designs' icon as placeholder
        label: 'Companys',
        href: '/list/companys',
        visible: ['admin', 'employee'], // Assuming same visibility as Designs
      },
      {
        icon: 'newDesign',
        label: 'New Design',
        href: '/list/designs/new', // Corrected path
        visible: ['admin', 'employee'],
      },
      {
        icon: 'notes',
        label: 'Notes',
        href: '/list/notes',
        visible: ['admin', 'employee'],
      },
      {
        icon: 'calendar',
        label: 'Calendar',
        href: '/list/calendar',
        visible: ['admin', 'employee'],
      },
      {
        icon: 'compare',
        label: 'Compare',
        href: '/list/compare',
        visible: ['admin', 'employee'],
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: 'profile',
        label: 'Profile',
        // href removed as this is handled by onClick
        visible: ['admin', 'employee'],
      },
      {
        icon: 'settings',
        label: 'Settings',
        href: '/settings',
        visible: ['admin', 'employee'],
      },
      {
        icon: 'logout',
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'employee'],
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname(); // Get current pathname
  const { data: session } = useSession(); // Get session data
  const { handleOpenModal } = useUserProfileModal(); // Access modal handler

  return (
    <div className=''>
      {menuItems.map((item) => (
        <div key={item.title} className='flex items-center lg:items-start flex-col'>
          <span className='hidden lg:block mt-6 text-xs'>{item.title}</span>
          {item.items.map((i) =>
            i.label === 'Logout' ? (
              <button
                key={i.label}
                onClick={() => signOut({ callbackUrl: '/' })}
                className='flex lg:w-full lg:min-w-[150px] justify-center items-center lg:justify-start gap-3 px-4 py-2 my-1 mx-[-16px] rounded-full text-left hover:bg-primary-hover hover:transition-all duration-200 ease-in-out'
              >
                <CustomIcon name='logout' className='w-[15px] h-[15px]' />
                <span className='hidden lg:block'>{i.label}</span>
              </button>
            ) : i.label === 'Profile' ? (
              <button
                key={i.label}
                onClick={handleOpenModal}
                className='flex lg:w-full lg:min-w-[150px] justify-center items-center lg:justify-start gap-3 px-4 py-2 my-1 mx-[-16px] rounded-full text-left hover:bg-primary-hover hover:transition-all duration-200 ease-in-out'
              >
                <CustomIcon name='profile' className='w-[15px] h-[15px]' />
                <span className='hidden lg:block'>{i.label}</span>
              </button>
            ) : (
              <Link
                href={i.href!} // Add non-null assertion
                className={`flex lg:w-full lg:min-w-[150px] hover:bg-primary-hover justify-center items-center lg:justify-start gap-3 px-4 py-2 my-1 mx-[-16px] rounded-full  hover:transition-all duration-200 ease-in-out ${
                  pathname === i.href
                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover  hover:transition-all duration-200 ease-in-out'
                    : '' // Add conditional background
                }`}
                key={i.label} // Use label as key instead of href
              >
                <CustomIcon
                  name={
                    i.icon as
                      | 'home'
                      | 'employee'
                      | 'designs'
                      | 'newDesign'
                      | 'notes'
                      | 'calendar'
                      | 'compare'
                      | 'profile'
                      | 'settings'
                    // 'logout' is handled above
                  }
                  className='w-[15px] h-[15px]' // Adjusted size for mobile
                />
                <span className='hidden lg:block'>{i.label}</span>
              </Link>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

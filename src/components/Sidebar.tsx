'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
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
        href: '/employees', // Corrected path
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
        href: '/designs/new', // Corrected path
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
      {
        icon: 'notes',
        label: 'Notes',
        href: '/notes',
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
        href: '/profile',
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
                className='flex lg:w-full lg:min-w-[150px] lg:hover:bg-lightHoverColor lg:hover:dark:text-darkTextColor2 lg:hover:transition justify-center items-center lg:justify-start gap-3 px-4 py-2 my-1 mx-[-16px] rounded-full text-left'
              >
                <CustomIcon name='logout' />
                <span className='hidden lg:block'>{i.label}</span>
              </button>
            ) : (
              <Link
                href={i.href}
                className='flex lg:w-full lg:min-w-[150px]  lg:hover:bg-lightHoverColor lg:hover:dark:text-darkTextColor2 lg:hover:transition justify-center items-center lg:justify-start gap-3 px-4 py-2 my-1 mx-[-16px] rounded-full'
                key={i.href}
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

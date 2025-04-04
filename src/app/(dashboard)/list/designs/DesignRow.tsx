'use client';

import { useState } from 'react';
import Link from 'next/link';
import StatusChanger from '@/components/StatusChanger';
import CustomIcon from '@/components/CustomIcon';
import { format } from 'date-fns';

type Design = {
  id: number;
  status: string;
  designer?: string;
  partner?: string;
  createdAt: Date;
  updatedAt: Date;
  company: { name: string };
  employee: { username: string } | null; // Allow employee to be null
  partners: string | null;
  companyId: number;
  employeeId: number;
};

const STATUS_OPTIONS = {
  New: { label: 'New', value: 'New', icon: 'new', color: 'text-[#010101]' },
  Waiting: { label: 'Waiting', value: 'Waiting', icon: 'waiting', color: 'text-[#CC831F]' },
  'Not send': { label: 'Not send', value: 'Not send', icon: 'notSend', color: 'text-[#8369FF]' },
  Send: { label: 'Send', value: 'Send', icon: 'send', color: 'text-[#2058DC]' },
  Done: { label: 'Done', value: 'Done', icon: 'done', color: 'text-[#25A955]' },
};

const DesignRow = ({ item }: { item: Design }) => {
  
  const formattedCreatedAtDate = format(item.createdAt, 'dd.MM.yyyy');
  const formattedUpdatedAtDate = format(item.updatedAt, 'dd.MM.yyyy');

  return (
    <tr
      key={item.id}
      className='border-lightEmphasisColor dark:border-darkEmphasisColor border-b text-sm hover:bg-lightEmphasisColor dark:hover:bg-darkEmphasisColor'
    >
      <td className='h-12 px-4'>{item.companyId}</td>
      <td className='hidden md:table-cell px-4'>{item.company.name}</td>
      <td className='px-4'>
      <StatusChanger
          itemId={item.id.toString()} // Convert number to string
          currentStatusValue={item.status} // Pass the current status from DB
        />
      </td>
      <td className='px-4'>
        <div className='flex flex-col'>
          <span className='font-semibold leading-3'>{item.employee?.username ?? 'N/A'}</span>
          <span className='text-xs font-thin'>{item.partners}</span>
        </div>
      </td>
      <td className='hidden md:table-cell px-4'>{formattedCreatedAtDate}</td>
      <td className='hidden md:table-cell px-4'>{formattedUpdatedAtDate}</td>
      <td className='px-4 pt-3 flex gap-4'>
        <Link href=''>
          <button>
            <CustomIcon name='delete' />
          </button>
        </Link>
        <button>
          <CustomIcon name='details' />
        </button>
      </td>
    </tr>
  );
};

export default DesignRow;

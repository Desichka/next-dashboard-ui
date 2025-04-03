import Image from 'next/image';

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4'>
      {/*search*/}
      <div className='hidden lg:flex items-center gap-2 text-xs rounded-full ring-1 ring-neutral-300 dark:ring-neutral-700 px-2'>
        <Image src='/search.png' alt='' width={14} height={14} />
        <input
          type='text'
          placeholder='Search...'
          className='p-2 bg-transparent dark:text-darkTextColor focus:outline-none'
        />
      </div>
      {/*user*/}
      <div className='flex items-center gap-4 cursor-pointer'>
        <span className='flex flex-col'>
          <span className='text-xs leading-3 font-semibold text-lightTextColor dark:text-darkTextColor'>
            Desislava Todorova
          </span>
          <span className='text-xs leading-4 font-thin text-neutral-600 dark:text-neutral-500'>
            Admin
          </span>
        </span>
        <Image src='/avatar.png' alt='avatar' width={35} height={35} className='rounded-full' />
      </div>
    </div>
  );
};
export default Navbar;

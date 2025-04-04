import Image from 'next/image';
// TableSearch removed as it's no longer used here

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4'>
      {/* Placeholder or other content can go here if needed */}
      <div className='flex-1'></div> {/* Add a flexible div to push user info to the right */}
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

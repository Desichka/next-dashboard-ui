import Image from "next/image";

const TableSearch = () => {


    return (

        <div
            className='w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-1 ring-neutral-300 dark:ring-neutral-700 px-2'>
            <Image src='/search.png' alt="" width={14} height={14}/>
            <input type='text' placeholder='Search...'
                   className="p-2 bg-transparent dark:text-darkTextColor focus:outline-none"/>
        </div>

    );
}
export default TableSearch;
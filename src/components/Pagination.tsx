const Pagination = () => {
    return (
        <div className="flex justify-center py-4 justify-between">
            <button
                className="px-4 py-1 bg-lightButtonColor text-emerald-200 rounded-full opacity-70 hover:opacity-100 disabled:opacity-30">
                Previous
            </button>
            <div className="flex items-center justify-center gap-2">
                <button
                    className="w-8 h-8 rounded-full text-lightTextColor dark:text-darkTextColor hover:bg-lightButtonColor hover:text-lightCardBgColor">1
                </button>
                <button
                    className="w-8 h-8 rounded-full text-lightTextColor dark:text-darkTextColor hover:bg-lightButtonColor hover:text-lightCardBgColor">1
                </button>
            </div>
            <button
                className="px-4 py-1  bg-lightButtonColor text-emerald-200 rounded-full opacity-70 hover:opacity-100 disabled:opacity-30">
                Next
            </button>
        </div>
    );
}

export default Pagination;
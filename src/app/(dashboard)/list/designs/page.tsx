import CustomIcon from "@/components/CustomIcon";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import Image from "next/image";
import {teachersData} from "@/lib/data";
import DesignRow from "./DesignRow";

type Design = {
    id: number;
    number: number;
    name: string;
    status: string;
    designer?: string;
    partner?: string;
    date: string;
}

const columns = [
    {
        header: "Company №",
        accessor: "companyNumber",
        className: "table-cell",
    },
    {
        header: "Company Name",
        accessor: "companyName",
        className: "hidden md:table-cell",
    },
    {
        header: "Status",
        accessor: "status",
        className: "table-cell",
    },
    {
        header: "Team",
        accessor: "team",
        className: "table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
        className: "table-cell",
    },
]


const DesignsPage = () => {

    const renderRow = (item: Design) => <DesignRow item={item}/>;

    return (
        <div
            className="bg-lightCardBgColor dark:bg-darkCardBgColor shadow  p-4 rounded-2xl flex-1 m-4 mt-0">
            {/*top*/}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-xl font-semibold text-lightTextColor dark:text-darkTextColor">Designs</h1>
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 md:self-end">
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-full shadow bg-lightButtonColor text-darkTextColor2 hover:bg-emerald-600">
                            <CustomIcon name="filter" className="text-lightCardBgColor dark:text-neutral-300"/>
                        </button>
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-full shadow bg-lightButtonColor text-darkTextColor2 hover:bg-emerald-600">
                            <CustomIcon name="sort" className="text-lightCardBgColor dark:text-neutral-300"/>
                        </button>
                        <button
                            className="text-2xl w-9 h-9 flex items-center justify-center rounded-full shadow bg-lightActiveColor text-lightTextColor dark:text-darkCardBgColor hover:bg-emerald-600">
                            +
                        </button>
                    </div>
                </div>
            </div>
            {/*list*/}
            <Table columns={columns} renderRow={renderRow} data={teachersData}/>
            {/*pagination*/}
            <Pagination/>
        </div>
    );
}
export default DesignsPage;


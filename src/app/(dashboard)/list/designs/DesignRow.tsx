"use client";

import {useState} from "react";
import Link from "next/link";
import Status from "@/components/Status";
import CustomIcon from "@/components/CustomIcon";

type Design = {
    id: number;
    number: number;
    name: string;
    status: string;
    designer?: string;
    partner?: string;
    date: string;
};

interface Option {
    label: string;
    value: string;
    icon: string; // e.g., icon name for your CustomIcon component
    color: string; // e.g., Tailwind CSS color class or inline color value
}

const STATUS_OPTIONS = {
    New: {label: "New", value: "New", icon: "new", color: "text-[#010101]"},
    Waiting: {label: "Waiting", value: "Waiting", icon: "waiting", color: "text-[#CC831F]"},
    "Not send": {label: "Not send", value: "Not send", icon: "notSend", color: "text-[#8369FF]"},
    "Send": {label: "Send", value: "Send", icon: "send", color: "text-[#2058DC]"},
    Done: {label: "Done", value: "Done", icon: "done", color: "text-[#25A955]"},
};

const getStatusClass = (status: string) => {
    switch (status) {
        case "New":
            return "status-new";
        case "Waiting":
            return "status-waiting";
        case "Not send":
            return "status-not-send";
        case "Send":
            return "status-not-approved";
        case "Done":
            return "status-done";
        default:
            return "";
    }
};

const DesignRow = ({item}: { item: Design }) => {
    const [status, setStatus] = useState(item.status);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        console.log(`Status changed to: ${newStatus}`);
    };

    return (
        <tr key={item.id}
            className="border-lightEmphasisColor dark:border-darkEmphasisColor border-b text-sm hover:bg-lightEmphasisColor dark:hover:bg-darkEmphasisColor">
            <td className="h-12 px-4">{item.number}</td>
            <td className="hidden md:table-cell px-4">{item.name}</td>
            <td className="px-4">
                <Status
                    options={Object.values(STATUS_OPTIONS)}
                    selected={status}
                    onChange={(newStatus: string) => {
                        setStatus(newStatus);
                        console.log(`Status changed to: ${newStatus}`);
                    }}
                />
            </td>
            <td className="px-4">
                <div className="flex flex-col">
                    <span className="font-semibold leading-3">{item.designer}</span>
                    <span className="text-xs font-thin">{item.partner}</span>
                </div>
            </td>
            <td className="hidden md:table-cell px-4">{item.date}</td>
            <td className="px-4 pt-3 flex gap-4">
                <Link href="">
                    <button>
                        <CustomIcon name="delete"/>
                    </button>
                </Link>
                <button>
                    <CustomIcon name="details"/>
                </button>

            </td>
        </tr>
    );
};

export default DesignRow;

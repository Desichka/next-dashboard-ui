import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className="flex min-h-screen bg-lightBgColor dark:bg-darkBgColor text-lightTextColor dark:text-darkTextColor">
            {/*LEFT*/}
            <div
                className="flex flex-col lg:justify-between w-[10%] lg:min-w-[190px] p-2 lg:p-8 border-r-gray-200 shadow-gray-300 shadow-xl dark:border-r-neutral-950 dark:shadow-neutral-950 border-r-[1px]  ">
                <div>
                    <Link href="/" className='flex justify-center items-center lg:justify-start gap-3 py-4'>
                        <Logo/>
                        <span className='hidden lg:block text-xl font-bold'>MyWork</span>
                    </Link>
                    <Sidebar/>
                </div>
                <ThemeToggle/>
            </div>
            {/*RIGHT*/}
            <div className="w-[85%]">
                <Navbar/>
                {children}
            </div>
        </div>
    );
}

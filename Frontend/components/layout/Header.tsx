
// "use client";

// import { usePathname } from "next/navigation";
// import { Bell, ChevronDown, Menu, Search } from "lucide-react";

// interface HeaderProps {
//     onMenuClick: () => void;
// }

// const pageTitles: Record<string, string> = {
//     "/": "Overview",
//     "/projects": "Projects",
//     "/tasks": "My Tasks",
//     "/team": "Team",
//     "/notifications": "Notifications",
//     "/settings": "Settings",
// };

// export default function Header({ onMenuClick }: HeaderProps) {
//     const pathname = usePathname();

//     const title =
//         pageTitles[pathname] ??
//         (pathname.startsWith("/projects/") ? "Project Management" : "Workspace");

//     return (
//         <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-7 xl:px-10">
//             <div className="flex min-w-0 items-center gap-3">
//                 <button
//                     type="button"
//                     onClick={onMenuClick}
//                     aria-label="Open navigation"
//                     className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
//                 >
//                     <Menu size={21} />
//                 </button>

//                 <div className="hidden text-xs text-slate-400 sm:block">
//                     Workspace <span className="mx-2">/</span>
//                 </div>

//                 <h1 className="truncate text-sm font-semibold text-slate-800">
//                     {title}
//                 </h1>
//             </div>

//             <div className="flex items-center gap-3 sm:gap-4">
//                 <label className="hidden h-10 w-52 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 md:flex xl:w-64">
//                     <Search size={16} className="shrink-0 text-slate-400" />
//                     <input
//                         placeholder="Search..."
//                         aria-label="Search"
//                         className="w-full bg-transparent text-xs outline-none"
//                     />
//                 </label>

//                 <button
//                     type="button"
//                     aria-label="Notifications"
//                     className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
//                 >
//                     <Bell size={18} />
//                     <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
//                 </button>

//                 <div className="hidden h-8 border-l border-slate-200 sm:block" />

//                 <div className="flex items-center gap-2">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
//                         RB
//                     </div>
//                     <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
//                 </div>
//             </div>
//         </header>
//     );
// }


"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
    "/": "Overview",
    "/projects": "Projects",
    "/tasks": "My Tasks",
    "/team": "Team Members",
    "/notifications": "Notifications",
    "/settings": "Settings",
};

export default function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();

    const title =
        pageTitles[pathname] ??
        (pathname.startsWith("/projects/")
            ? "Project Management"
            : "Workspace");

    return (
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-7 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    className="rounded-lg p-2 text-brand-muted transition hover:bg-hover-background hover:text-brand-primary lg:hidden"
                >
                    <Menu size={21} />
                </button>

                <div className="hidden text-xs text-brand-muted sm:block">
                    Workspace <span className="mx-2">/</span>
                </div>

                <h1 className="truncate text-sm font-semibold text-foreground">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <label className="hidden h-10 w-52 items-center gap-2 rounded-lg border border-border bg-muted-background px-3 transition focus-within:border-brand-primary md:flex xl:w-64">
                    <Search size={16} className="shrink-0 text-brand-muted" />
                    <input
                        placeholder="Search..."
                        aria-label="Search"
                        className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-brand-muted"
                    />
                </label>

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-brand-muted transition hover:bg-hover-background hover:text-brand-primary"
                >
                    <Bell size={18} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-card bg-brand-primary" />
                </button>

                <div className="hidden h-8 border-l border-border sm:block" />

                <button
                    type="button"
                    aria-label="Account menu"
                    className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-hover-background"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-beige text-[10px] font-semibold text-brand-primary">
                        RB
                    </div>
                    <ChevronDown
                        size={15}
                        className="hidden text-brand-muted sm:block"
                    />
                </button>
            </div>
        </header>
    );
}
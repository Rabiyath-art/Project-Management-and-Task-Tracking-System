
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//     Archive,
//     Bell,
//     ChartNoAxesCombined,
//     CheckSquare,
//     ChevronDown,
//     Command,
//     FolderKanban,
//     LayoutDashboard,
//     MoreHorizontal,
//     Settings,
//     Users,
//     X,
// } from "lucide-react";

// interface SidebarProps {
//     mobileMenuOpen: boolean;
//     onClose: () => void;
// }

// const navigation = [
//     { label: "Overview", href: "/", icon: LayoutDashboard },
//     { label: "Projects", href: "/projects", icon: FolderKanban },
//     { label: "My Tasks", href: "/tasks", icon: CheckSquare },
//     { label: "Team", href: "/team", icon: Users },
// ];

// export default function Sidebar({
//     mobileMenuOpen,
//     onClose,
// }: SidebarProps) {
//     const pathname = usePathname();

//     return (
//         <>
//             {mobileMenuOpen && (
//                 <button
//                     type="button"
//                     aria-label="Close navigation overlay"
//                     onClick={onClose}
//                     className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
//                 />
//             )}

//             <aside
//                 className={`fixed inset-y-0 left-0 z-50 w-[252px] border-r border-slate-200 bg-white transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//                     } lg:translate-x-0`}
//             >
//                 <div className="flex h-full flex-col">
//                     <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
//                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
//                             <Command size={20} />
//                         </div>

//                         <div>
//                             <p className="text-base font-bold text-slate-950">
//                                 ProjectFlow
//                             </p>
//                             <p className="text-[10px] font-medium tracking-[0.14em] text-slate-400">
//                                 WORKSPACE
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={onClose}
//                             aria-label="Close sidebar"
//                             className="ml-auto text-slate-400 lg:hidden"
//                         >
//                             <X size={20} />
//                         </button>
//                     </div>

//                     <div className="px-4 pt-6">
//                         <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
//                             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
//                                 AC
//                             </div>
//                             <div className="min-w-0 flex-1">
//                                 <p className="truncate text-xs font-semibold text-slate-800">
//                                     Project Workspace
//                                 </p>
//                                 <p className="mt-1 text-[11px] text-slate-500">
//                                     Team projects
//                                 </p>
//                             </div>
//                             <ChevronDown size={15} className="text-slate-400" />
//                         </div>
//                     </div>

//                     <nav className="px-4 pt-7">
//                         <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
//                             Workspace
//                         </p>

//                         <div className="space-y-1">
//                             {navigation.map(({ label, href, icon: Icon }) => {
//                                 const active =
//                                     href === "/"
//                                         ? pathname === "/"
//                                         : pathname === href ||
//                                         pathname.startsWith(`${href}/`);

//                                 return (
//                                     <Link
//                                         key={href}
//                                         href={href}
//                                         onClick={onClose}
//                                         className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${active
//                                                 ? "bg-indigo-50 text-indigo-700"
//                                                 : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                                             }`}
//                                     >
//                                         <Icon size={18} strokeWidth={1.8} />
//                                         <span>{label}</span>
//                                     </Link>
//                                 );
//                             })}
//                         </div>
//                     </nav>

//                     <div className="mt-8 px-4">
//                         <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
//                             Personal
//                         </p>

//                         <div className="space-y-1">
//                             <Link
//                                 href="/notifications"
//                                 onClick={onClose}
//                                 className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
//                             >
//                                 <Bell size={18} />
//                                 Notifications
//                             </Link>

//                             <Link
//                                 href="/settings"
//                                 onClick={onClose}
//                                 className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
//                             >
//                                 <Settings size={18} />
//                                 Settings
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="mt-auto p-4">
//                         <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
//                             <div className="mb-2 flex items-center gap-2 text-indigo-700">
//                                 <ChartNoAxesCombined size={17} />
//                                 <span className="text-xs font-semibold">
//                                     Workspace insights
//                                 </span>
//                             </div>
//                             <p className="text-[11px] leading-5 text-slate-600">
//                                 Review project deadlines and task progress from one place.
//                             </p>
//                         </div>

//                         <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
//                                 RB
//                             </div>
//                             <div className="min-w-0 flex-1">
//                                 <p className="truncate text-xs font-semibold text-slate-800">
//                                     Current user
//                                 </p>
//                                 <p className="mt-1 text-[10px] text-slate-500">
//                                     Workspace member
//                                 </p>
//                             </div>
//                             <MoreHorizontal size={19} className="text-slate-400" />
//                         </div>
//                     </div>
//                 </div>
//             </aside>
//         </>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Archive, Bell, ChartNoAxesCombined, CheckSquare, ChevronDown, Command, FolderKanban, LayoutDashboard, MoreHorizontal, Settings, Users, X,
} from "lucide-react";

interface SidebarProps {
    mobileMenuOpen: boolean;
    onClose: () => void;
}

const navigation = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Team", href: "/team", icon: Users },
];

export default function Sidebar({
    mobileMenuOpen,
    onClose,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation overlay"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-[252px] border-r border-slate-200 bg-white transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <div className="flex h-full flex-col">
                    <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white">
                            <Command size={20} />
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-950">ProjectFlow</p>
                            <p className="text-[10px] font-medium tracking-[0.14em] text-slate-400">WORKSPACE</p>
                        </div>
                        <button type="button" onClick={onClose} aria-label="Close sidebar" className="ml-auto text-slate-400 lg:hidden">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-4 pt-6">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-beige text-sm font-bold text-brand-primary">
                                AC
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-800">Project Workspace</p>
                                <p className="mt-1 text-[11px] text-slate-500">Team projects</p>
                            </div>
                            <ChevronDown size={15} className="text-slate-400" />
                        </div>
                    </div>

                    <nav className="px-4 pt-7">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Workspace</p>
                        <div className="space-y-1">
                            {navigation.map(({ label, href, icon: Icon }) => {
                                const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${active
                                            ? "bg-stone-100 text-brand-primary font-semibold"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={1.8} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="mt-8 px-4">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Personal</p>
                        <div className="space-y-1">
                            <Link href="/notifications" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50">
                                <Bell size={18} />
                                Notifications
                            </Link>
                            <Link href="/settings" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50">
                                <Settings size={18} />
                                Settings
                            </Link>
                        </div>
                    </div>

                    <div className="mt-auto p-4">
                        <div className="rounded-xl border border-brand-border bg-gradient-to-br from-stone-50 to-white p-4">
                            <div className="mb-2 flex items-center gap-2 text-brand-primary">
                                <ChartNoAxesCombined size={17} />
                                <span className="text-xs font-semibold">Workspace insights</span>
                            </div>
                            <p className="text-[11px] leading-5 text-slate-600">
                                Review project deadlines and task progress from one place.
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-beige text-[10px] font-semibold text-brand-primary">
                                RB
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-800">Current user</p>
                                <p className="mt-1 text-[10px] text-slate-500">Workspace member</p>
                            </div>
                            <MoreHorizontal size={19} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

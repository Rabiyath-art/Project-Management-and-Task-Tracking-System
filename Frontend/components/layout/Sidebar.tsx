
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell, CheckSquare, Command, FolderKanban, LayoutDashboard, MoreHorizontal, Settings, Users, X,
} from "lucide-react";

import { authService } from "@/services/auth.service";

interface SidebarProps {
    mobileMenuOpen: boolean;
    onClose: () => void;
}

interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

const navigation = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Team", href: "/team", icon: Users },
];

export default function Sidebar({ mobileMenuOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        let active = true;

        async function loadCurrentUser() {
            try {
                const response = await authService.getCurrentUser();

                if (active && response.success) {
                    setCurrentUser(response.data.user);
                }
            } catch (error) {
                console.error("Failed to load current user:", error);
            }
        }

        void loadCurrentUser();

        return () => { active = false; };
    }, []);

    const initials = currentUser?.name
        ? currentUser.name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("")
        : "U";

    const roleLabel = currentUser?.role
        ? currentUser.role.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        : "Workspace member";

    return (
        <>
            {mobileMenuOpen && (
                <button type="button" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[252px] border-r border-slate-200 bg-white transition-transform duration-200 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="flex h-full flex-col">
                    {/* Brand */}
                    <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white">
                            <Command size={20} />
                        </div>

                        <div>
                            <p className="text-base font-bold text-slate-950">
                                ProjectFlow
                            </p>
                            <p className="text-[10px] font-medium tracking-[0.14em] text-slate-400">
                                Task Management
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close sidebar"
                            className="ml-auto text-slate-400 lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="px-4 pt-7">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Workspace
                        </p>

                        <div className="space-y-1">
                            {navigation.map(({ label, href, icon: Icon }) => {
                                const active =
                                    href === "/"
                                        ? pathname === "/"
                                        : pathname === href ||
                                        pathname.startsWith(`${href}/`);

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${active
                                            ? "bg-stone-100 font-semibold text-brand-primary"
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

                    {/* Personal navigation */}
                    <div className="mt-8 px-4">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Personal
                        </p>

                        <div className="space-y-1">
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                            >
                                <Bell size={18} />
                                Notifications
                            </Link>

                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                            >
                                <Settings size={18} />
                                Settings
                            </Link>
                        </div>
                    </div>

                    {/* Logged-in user */}
                    <div className="mt-auto p-4">
                        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-beige text-[10px] font-semibold text-brand-primary">
                                {initials}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-800">
                                    {currentUser?.name ?? "Loading user..."}
                                </p>
                                <p className="mt-1 truncate text-[10px] text-slate-500">
                                    {currentUser ? roleLabel : " "}
                                </p>
                            </div>

                            <MoreHorizontal size={19} className="shrink-0 text-slate-400" />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

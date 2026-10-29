
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Search, UserRound } from "lucide-react";

import { authService } from "@/services/auth.service";

interface HeaderProps {
    onMenuClick: () => void;
}

interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

const pageTitles: Record<string, string> = {
    "/": "Overview",
    "/projects": "Projects",
    "/tasks": "My Tasks",
    "/team": "Team Members"
};

export default function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    useEffect(() => {
        let active = true;
        async function loadCurrentUser() {
            try {
                const response = await authService.getCurrentUser();

                if (active && response.success) {
                    setCurrentUser(response.data.user);
                }
            } catch (error) {
                console.error("Failed to load header user:", error);
            }
        }

        void loadCurrentUser();

        return () => {
            active = false;
        };
    }, []);

    const title = pageTitles[pathname] ?? (pathname.startsWith("/projects/") ? "Project Management"
        : "Workspace");

    const initials = currentUser?.name
        ? currentUser.name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase())
            .join("")
        : "U";

    const roleLabel = currentUser?.role
        ? currentUser.role.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        : "Workspace member";

    function handleLogout() {
        setAccountMenuOpen(false);
        authService.logout();
    }

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
                    onClick={() => router.push("/notifications")}
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border text-brand-muted transition hover:bg-hover-background hover:text-brand-primary"
                >
                    <Bell size={18} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-card bg-brand-primary" />
                </button>

                <div className="hidden h-8 border-l border-border sm:block" />

                <div className="relative">
                    <button type="button"
                        aria-expanded={accountMenuOpen}
                        onClick={() => setAccountMenuOpen((open) => !open)}
                        className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-hover-background"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-beige text-[10px] font-semibold text-brand-primary">
                            {initials}
                        </div>

                        <div className="hidden max-w-32 text-left sm:block">
                            <p className="truncate text-xs font-semibold text-foreground">
                                {currentUser?.name ?? "Loading..."}
                            </p>
                            <p className="truncate text-[10px] text-brand-muted">
                                {currentUser ? roleLabel : " "}
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className={`hidden text-brand-muted transition-transform sm:block ${accountMenuOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {accountMenuOpen && (
                        <>
                            <button
                                type="button"
                                aria-label="Close account menu"
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setAccountMenuOpen(false)}
                            />

                            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-lg">
                                <button type="button" onClick={() => {
                                    setAccountMenuOpen(false);
                                    router.push("/settings");
                                }}
                                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-hover-background"
                                >
                                    <UserRound size={16} />
                                    Account settings
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                >
                                    <LogOut size={16} />
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

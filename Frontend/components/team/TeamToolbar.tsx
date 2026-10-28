"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { MemberStatus, TeamRole } from "@/types/team.types";

interface TeamToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    role: TeamRole | "ALL";
    onRoleChange: (value: TeamRole | "ALL") => void;
    status: MemberStatus | "ALL";
    onStatusChange: (value: MemberStatus | "ALL") => void;
    onReset: () => void;
}

const selectClass =
    "min-w-36 rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";

export default function TeamToolbar({ search, onSearchChange, role, onRoleChange, status, onStatusChange, onReset,
}: TeamToolbarProps) {
    const hasFilters = search !== "" || role !== "ALL" || status !== "ALL";

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search by name or email..."
                    aria-label="Search team members"
                    className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-brand-muted">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-xs font-medium">Filters</span>
                </div>

                <select value={role} onChange={(event) => onRoleChange(event.target.value as TeamRole | "ALL")}
                    aria-label="Filter by role"
                    className={selectClass}>
                    <option value="ALL">All roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="MEMBER">Member</option>
                </select>

                <select value={status} onChange={(event) => onStatusChange(event.target.value as MemberStatus | "ALL")} aria-label="Filter by status"
                    className={selectClass}
                >
                    <option value="ALL">All statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>

                {hasFilters && (
                    <button type="button" onClick={onReset} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-brand-muted transition hover:bg-hover-background hover:text-brand-primary">
                        <X className="h-4 w-4" />
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}

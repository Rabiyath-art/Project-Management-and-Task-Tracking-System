"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Eye, UserRoundX, UserRoundCheck, Users, } from "lucide-react";
import type { TeamMember } from "@/types/team.types";

interface TeamTableProps {
    members: TeamMember[];
    onEdit: (member: TeamMember) => void;
    onView: (member: TeamMember) => void;
    onToggleStatus: (member: TeamMember) => void;
}

function getInitials(name: string) {
    return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function roleLabel(role: TeamMember["role"]) {
    if (role === "PROJECT_MANAGER") return "Project Manager";
    if (role === "ADMIN") return "Admin";
    return "Member";
}

function roleClass(role: TeamMember["role"]) {
    if (role === "ADMIN") {
        return "bg-brand-primary/10 text-brand-primary";
    }

    if (role === "PROJECT_MANAGER") {
        return "bg-brand-sage/25 text-foreground";
    }

    return "bg-muted-background text-brand-muted";
}

export default function TeamTable({ members, onEdit, onView, onToggleStatus }: TeamTableProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="rounded-2xl bg-brand-beige/50 p-4 text-brand-primary">
                    <Users className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                    No members found
                </h3>
                <p className="mt-1 max-w-sm text-sm leading-6 text-brand-muted">
                    Try changing your search or filters, or add a new team member.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
                <thead>
                    <tr className="border-b border-border bg-muted-background/70">
                        {["Member", "Role", "Projects", "Status", "Joined date", "Actions",].map((heading) => (
                            <th key={heading} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {members.map((member) => (
                        <tr key={member.id} className="transition-colors hover:bg-hover-background/70">
                            <td className="px-5 py-4">
                                <button type="button" onClick={() => onView(member)} className="group flex items-center gap-3 text-left">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-beige/60 text-xs font-bold text-brand-primary">
                                        {getInitials(member.name)}
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-brand-primary">
                                            {member.name}
                                        </span>
                                        <span className="mt-1 block text-xs text-brand-muted">
                                            {member.email}
                                        </span>
                                    </span>
                                </button>
                            </td>

                            <td className="px-5 py-4">
                                <span
                                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium ${roleClass(
                                        member.role
                                    )}`}
                                >
                                    {roleLabel(member.role)}
                                </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-medium text-foreground">
                                {member.projectsCount}
                            </td>

                            <td className="px-5 py-4">
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${member.status === "ACTIVE"
                                        ? "text-sys-success"
                                        : "text-brand-muted"
                                        }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${member.status === "ACTIVE"
                                            ? "bg-sys-success"
                                            : "bg-brand-sage"
                                            }`}
                                    />
                                    {member.status === "ACTIVE" ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-brand-muted">
                                {formatDate(member.joinedAt)}
                            </td>

                            <td className="relative px-5 py-4">
                                <button
                                    type="button"
                                    aria-label={`Actions for ${member.name}`}
                                    aria-expanded={openMenuId === member.id}
                                    onClick={() =>
                                        setOpenMenuId((current) =>
                                            current === member.id ? null : member.id
                                        )
                                    }
                                    className="rounded-lg p-2 text-brand-muted transition hover:bg-muted-background hover:text-brand-primary"
                                >
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>

                                {openMenuId === member.id && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Close member actions"
                                            className="fixed inset-0 z-10 cursor-default"
                                            onClick={() => setOpenMenuId(null)}
                                        />

                                        <div className="absolute right-8 top-12 z-20 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenMenuId(null);
                                                    onView(member);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-hover-background"
                                            >
                                                <Eye className="h-4 w-4 text-brand-muted" />
                                                View details
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenMenuId(null);
                                                    onEdit(member);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-hover-background"
                                            >
                                                <Pencil className="h-4 w-4 text-brand-muted" />
                                                Edit member
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenMenuId(null);
                                                    onToggleStatus(member);
                                                }}
                                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition hover:bg-hover-background ${member.status === "ACTIVE"
                                                    ? "text-sys-danger"
                                                    : "text-sys-success"
                                                    }`}
                                            >
                                                {member.status === "ACTIVE" ? (
                                                    <UserRoundX className="h-4 w-4" />
                                                ) : (
                                                    <UserRoundCheck className="h-4 w-4" />
                                                )}
                                                {member.status === "ACTIVE"
                                                    ? "Deactivate member"
                                                    : "Activate member"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

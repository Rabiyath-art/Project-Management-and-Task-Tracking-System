"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, ChevronLeft, ChevronRight, CheckCircle2, X } from "lucide-react";
import TeamSummary from "@/components/team/TeamSummary";
import TeamToolbar from "@/components/team/TeamToolbar";
import TeamTable from "@/components/team/TeamTable";
import TeamMemberModal from "@/components/team/TeamMemberModal";
import { teamService } from "@/services/team.service";
import type { MemberStatus, TeamMember, TeamMemberFormValues, TeamRole } from "@/types/team.types";
import { userService } from "@/services/user.service";

type ModalMode = "create" | "edit" | "view";
const PAGE_SIZE = 10;

function mapApiUserToTeamMember(user: Awaited<ReturnType<typeof userService.getAll>>[number]): TeamMember {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: "ACTIVE",
        projectsCount: user.projectsCount,
        joinedAt: user.createdAt,
    };
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<TeamRole | "ALL">("ALL");
    const [status, setStatus] = useState<MemberStatus | "ALL">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [feedback, setFeedback] = useState("");
    const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

    useEffect(() => {
        let active = true;

        async function loadMembers() {
            try {
                const users = await userService.getAll();

                if (!active) return;

                const teamMembers: TeamMember[] = users.map(mapApiUserToTeamMember);
                setMembers(teamMembers);
            } catch (error) {
                console.error("Failed to load team members:", error);

                if (active) {
                    setFeedback("Unable to load team members from the server.");
                    setFeedbackType("error");
                }
            } finally {
                if (active) setIsReady(true);
            }
        }

        void loadMembers();

        return () => {
            active = false;
        };
    }, []);

    const filteredMembers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return members.filter((member) => {
            const matchesSearch = !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
            const matchesRole = role === "ALL" || member.role === role;
            const matchesStatus = status === "ALL" || member.status === status;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [members, search, role, status]);

    const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const visibleMembers = filteredMembers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const openModal = (mode: ModalMode, member: TeamMember | null = null) => {
        setSelectedMember(member);
        setModalMode(mode);
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedMember(null);
    };

    const showFeedback = (message: string, type: "success" | "error" = "success") => {
        setFeedback(message);
        setFeedbackType(type);
    };


    const handleSave = async (values: TeamMemberFormValues) => {
        try {
            if (modalMode === "create") {
                const result = await userService.create({
                    name: values.name,
                    email: values.email,
                    role: values.role,
                });

                const users = await userService.getAll();

                const teamMembers: TeamMember[] = users.map((user) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: "ACTIVE",
                    projectsCount: 0,
                    joinedAt: "",
                }));

                setMembers(teamMembers);
                setCurrentPage(1);

                showFeedback(
                    `User created successfully. Email: ${result.credentials.email} | Temporary password: ${result.credentials.temporaryPassword}. Share these credentials securely; no email was sent.`
                );
            } else if (modalMode === "edit" && selectedMember) {
                teamService.update(selectedMember.id, values);
                setMembers(teamService.getAll());
                showFeedback("Member details updated in demo storage.");
            }

            closeModal();
        } catch (error) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "response" in error
                    ? (
                        error as {
                            response?: {
                                data?: { message?: string };
                            };
                        }
                    ).response?.data?.message
                    : undefined;

            showFeedback(
                message ||
                (error instanceof Error
                    ? error.message
                    : "Unable to save member."),
                "error"
            );
        }
    };

    const handleToggleStatus = (member: TeamMember) => {
        const nextStatus =
            member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        const confirmed = window.confirm(
            `${nextStatus === "INACTIVE" ? "Deactivate" : "Activate"} ${member.name}?`
        );

        if (!confirmed) return;

        try {
            teamService.toggleStatus(member.id);
            setMembers(teamService.getAll());
            showFeedback(
                `${member.name} is now ${nextStatus === "ACTIVE" ? "active" : "inactive"
                }.`
            );
        } catch (error) {
            showFeedback(
                error instanceof Error ? error.message : "Unable to update member.",
                "error"
            );
        }
    };

    const resetFilters = () => {
        setSearch("");
        setRole("ALL");
        setStatus("ALL");
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, role, status]);

    if (!isReady) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand-primary" />
                <span className="ml-3 text-sm text-brand-muted">
                    Loading team members...
                </span>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Team Members
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-brand-muted">
                        Manage workspace members, roles and account status in one place.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => openModal("create")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                    <UserPlus className="h-4 w-4" />
                    Add member
                </button>
            </div>

            {feedback && (
                <div
                    role={feedbackType === "error" ? "alert" : "status"}
                    className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 ${feedbackType === "success"
                        ? "border-sys-success/20 bg-sys-success-bg text-sys-success"
                        : "border-sys-danger/20 bg-sys-danger-bg text-sys-danger"
                        }`}
                >
                    {feedbackType === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <p className="flex-1 text-sm">{feedback}</p>
                    <button
                        type="button"
                        onClick={() => setFeedback("")}
                        aria-label="Dismiss message"
                        className="rounded p-0.5 opacity-70 transition hover:opacity-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="mt-6">
                <TeamSummary members={members} />
            </div>

            <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-5 sm:p-6">
                    <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                All members
                            </h2>
                            <p className="mt-1 text-sm text-brand-muted">
                                Search and manage people in your workspace.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-muted-background px-3 py-1.5 text-xs font-semibold text-brand-primary">
                            {filteredMembers.length}{" "}
                            {filteredMembers.length === 1 ? "member" : "members"}
                        </span>
                    </div>

                    <TeamToolbar
                        search={search}
                        onSearchChange={setSearch}
                        role={role}
                        onRoleChange={setRole}
                        status={status}
                        onStatusChange={setStatus}
                        onReset={resetFilters}
                    />
                </div>

                <TeamTable
                    members={visibleMembers}
                    onEdit={(member) => openModal("edit", member)}
                    onView={(member) => openModal("view", member)}
                    onToggleStatus={handleToggleStatus}
                />

                <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-brand-muted">
                        {filteredMembers.length === 0
                            ? "Showing 0 members"
                            : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                                safePage * PAGE_SIZE,
                                filteredMembers.length
                            )} of ${filteredMembers.length} members`}
                    </p>

                    <div className="flex items-center gap-2">
                        <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))
                        }
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-hover-background disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>

                        <span className="px-2 text-sm font-medium text-foreground">
                            {safePage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() =>
                                setCurrentPage((page) => Math.min(totalPages, page + 1))
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-hover-background disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            {modalMode && (
                <TeamMemberModal
                    mode={modalMode}
                    member={selectedMember}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}

            <p className="mt-4 text-xs text-brand-muted">
                Demo mode: member changes are stored in this browser only.
            </p>
        </main>
    );
}

"use client";

import { useEffect, useState } from "react";
import { X, UserRound, Mail, ShieldCheck, BriefcaseBusiness, } from "lucide-react";
import type { TeamMember, TeamMemberFormValues, TeamRole, MemberStatus, } from "@/types/team.types";

type ModalMode = "create" | "edit" | "view";

interface TeamMemberModalProps {
    mode: ModalMode;
    member: TeamMember | null;
    onClose: () => void;
    onSave: (values: TeamMemberFormValues) => void;
}

const emptyValues: TeamMemberFormValues = {
    name: "",
    email: "",
    role: "MEMBER",
    status: "ACTIVE",
};

const fieldClass = "w-full rounded-xl border border-border bg-card py-3 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 read-only:bg-muted-background disabled:bg-muted-background";

const labelClass = "mb-2 block text-sm font-medium text-foreground";

export default function TeamMemberModal({ mode, member, onClose, onSave }: TeamMemberModalProps) {
    const [values, setValues] = useState<TeamMemberFormValues>(emptyValues);
    const [error, setError] = useState("");

    const readOnly = mode === "view";

    useEffect(() => {
        setValues(
            member ? {
                name: member.name, email: member.email, role: member.role, status: member.status,
            } : emptyValues
        );
        setError("");
    }, [member, mode]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const updateField = <Key extends keyof TeamMemberFormValues>(field: Key, value: TeamMemberFormValues[Key]
    ) => {
        setValues((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (readOnly) return;

        const name = values.name.trim();
        const email = values.email.trim().toLowerCase();

        if (name.length < 2) {
            setError("Name must contain at least 2 characters.");
            return;
        }

        if (name.length > 100) {
            setError("Name cannot exceed 100 characters.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address.");
            return;
        }

        onSave({ ...values, name, email });
    };

    const heading =
        mode === "create"
            ? "Add team member"
            : mode === "edit"
                ? "Edit team member"
                : "Member details";

    const description =
        mode === "create"
            ? "Add a member to your demo workspace."
            : mode === "edit"
                ? "Update this member's information and workspace role."
                : "Review this member's workspace information.";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="team-modal-title"
                className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2
                            id="team-modal-title"
                            className="text-lg font-bold text-foreground"
                        >
                            {heading}
                        </h2>
                        <p className="mt-1 text-sm text-brand-muted">{description}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-brand-muted transition hover:bg-hover-background hover:text-brand-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-sys-danger/20 bg-sys-danger-bg px-4 py-3 text-sm text-sys-danger"
                            >
                                {error}
                            </div>
                        )}

                        {readOnly && member && (
                            <div className="flex items-center gap-3 rounded-xl bg-muted-background p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-beige text-sm font-bold text-brand-primary">
                                    {member.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{member.name}</p>
                                    <p className="mt-1 text-xs text-brand-muted">{member.id}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="member-name" className={labelClass}>
                                Full name <span className="text-sys-danger">*</span>
                            </label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                                <input
                                    id="member-name"
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    value={values.name}
                                    readOnly={readOnly}
                                    onChange={(event) => updateField("name", event.target.value)}
                                    placeholder="Enter full name"
                                    className={fieldClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="member-email" className={labelClass}>
                                Email address <span className="text-sys-danger">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                                <input
                                    id="member-email"
                                    type="email"
                                    required
                                    maxLength={254}
                                    value={values.email}
                                    readOnly={readOnly}
                                    onChange={(event) => updateField("email", event.target.value)}
                                    placeholder="name@company.com"
                                    className={fieldClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="member-role" className={labelClass}>
                                Workspace role
                            </label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                                <select
                                    id="member-role"
                                    value={values.role}
                                    disabled={readOnly}
                                    onChange={(event) =>
                                        updateField("role", event.target.value as TeamRole)
                                    }
                                    className={`${fieldClass} appearance-none`}
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="PROJECT_MANAGER">Project Manager</option>
                                    <option value="MEMBER">Member</option>
                                </select>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-brand-muted">
                                Admins manage the workspace. Project managers coordinate
                                projects. Members work on assigned tasks.
                            </p>
                        </div>

                        {mode !== "create" && (
                            <div>
                                <label htmlFor="member-status" className={labelClass}>
                                    Account status
                                </label>
                                <select
                                    id="member-status"
                                    value={values.status}
                                    disabled={readOnly}
                                    onChange={(event) =>
                                        updateField("status", event.target.value as MemberStatus)
                                    }
                                    className="w-full rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground outline-none focus:border-brand-primary disabled:bg-muted-background"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        )}

                        {readOnly && member && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-border p-3">
                                    <BriefcaseBusiness className="h-4 w-4 text-brand-primary" />
                                    <p className="mt-2 text-xl font-bold text-foreground">
                                        {member.projectsCount}
                                    </p>
                                    <p className="text-xs text-brand-muted">Assigned projects</p>
                                </div>
                                <div className="rounded-xl border border-border p-3">
                                    <p className="text-xs text-brand-muted">Joined workspace</p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {new Date(member.joinedAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-border bg-muted-background/70 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-hover-background"
                        >
                            {readOnly ? "Close" : "Cancel"}
                        </button>

                        {!readOnly && (
                            <button
                                type="submit"
                                className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                            >
                                {mode === "create" ? "Add member" : "Save changes"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

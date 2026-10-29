"use client";

import { useState, useEffect, type FormEvent } from "react";
import { CalendarDays, FileText, FolderKanban, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Project, ProjectFormValues, ProjectMember, ProjectPriority, ProjectStatus, } from "@/types/project.types";
import { userService } from "@/services/user.service";

interface ProjectFormProps {
    initialProject?: Project;
    onSubmit: (values: ProjectFormValues) => void | Promise<void>;
    onCancel: () => void;
    submitting?: boolean;
}

const defaultValues: ProjectFormValues = {
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    startDate: "",
    deadline: "",
    memberIds: [],
};

const fieldClass =
    "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10";

const labelClass = "block text-sm font-medium text-foreground";

function SectionHeading({ icon, title, description, }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-beige text-brand-primary">
                {icon}
            </div>
            <div>
                <h2 className="font-semibold text-foreground">{title}</h2>
                <p className="mt-1 text-sm text-brand-muted">{description}</p>
            </div>
        </div>
    );
}

export default function ProjectForm({ initialProject, onSubmit, onCancel, submitting = false }: ProjectFormProps) {
    const [values, setValues] = useState<ProjectFormValues>(() =>
        initialProject
            ? {
                name: initialProject.name,
                description: initialProject.description,
                status: initialProject.status,
                priority: initialProject.priority,
                startDate: initialProject.startDate,
                deadline: initialProject.deadline,
                memberIds: initialProject.members.map((member) => member.id),
            }
            : { ...defaultValues },
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [membersLoading, setMembersLoading] = useState(true);
    const [membersError, setMembersError] = useState("");

    useEffect(() => {
        async function loadMembers() {
            try {
                setMembersError("");
                const users = await userService.getAll();
                setMembers(users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setMembersError("Unable to load team members.");
            } finally {
                setMembersLoading(false);
            }
        }

        loadMembers();
    }, []);

    function updateField<K extends keyof ProjectFormValues>(
        field: K,
        value: ProjectFormValues[K],
    ) {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function toggleMember(memberId: string) {
        setValues((current) => ({
            ...current,
            memberIds: current.memberIds.includes(memberId)
                ? current.memberIds.filter((id) => id !== memberId)
                : [...current.memberIds, memberId],
        }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors: Record<string, string> = {};

        if (!values.name.trim()) {
            nextErrors.name = "Project name is required.";
        } else if (values.name.trim().length < 3) {
            nextErrors.name = "Project name must be at least 3 characters.";
        }

        if (
            values.deadline &&
            values.startDate &&
            values.deadline < values.startDate
        ) {
            nextErrors.deadline = "Deadline must be on or after the start date.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        onSubmit({
            ...values,
            name: values.name.trim(),
            description: values.description.trim(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-7">
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                <SectionHeading
                    icon={<FolderKanban size={20} />}
                    title="Project information"
                    description="Enter the essential details for this project."
                />

                <div className="space-y-5">
                    <Input
                        label="Project name"
                        name="name"
                        placeholder="e.g. Customer Portal Redesign"
                        value={values.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        error={errors.name}
                        maxLength={120}
                        required
                    />

                    <div className="space-y-1.5">
                        <label htmlFor="description" className={labelClass}>
                            Description
                        </label>

                        <div className="relative">
                            <FileText
                                size={17}
                                className="absolute left-3 top-3 text-brand-muted"
                            />
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                maxLength={2000}
                                placeholder="Describe the project goals, scope, and expected outcome..."
                                value={values.description}
                                onChange={(event) =>
                                    updateField("description", event.target.value)
                                }
                                className={`${fieldClass} resize-y pl-10`}
                            />
                        </div>

                        <p className="text-right text-xs text-brand-muted">
                            {values.description.length}/2000
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label htmlFor="status" className={labelClass}>
                                Project status
                            </label>
                            <select
                                id="status"
                                value={values.status}
                                onChange={(event) =>
                                    updateField("status", event.target.value as ProjectStatus)
                                }
                                className={fieldClass}
                            >
                                <option value="PLANNING">Planning</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="ON_HOLD">On hold</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="priority" className={labelClass}>
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={values.priority}
                                onChange={(event) =>
                                    updateField("priority", event.target.value as ProjectPriority)
                                }
                                className={fieldClass}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                <SectionHeading
                    icon={<CalendarDays size={20} />}
                    title="Project timeline"
                    description="Set the planned start and completion dates."
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label htmlFor="startDate" className={labelClass}>
                            Start date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={values.startDate}
                            onChange={(event) => updateField("startDate", event.target.value)}
                            max={values.deadline || undefined}
                            className={fieldClass}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="deadline" className={labelClass}>
                            Deadline
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            min={values.startDate || undefined}
                            value={values.deadline}
                            onChange={(event) => updateField("deadline", event.target.value)}
                            aria-invalid={Boolean(errors.deadline)}
                            className={`${fieldClass} ${errors.deadline
                                ? "border-sys-danger focus:ring-sys-danger/10"
                                : ""
                                }`}
                        />
                        {errors.deadline && (
                            <p className="text-xs text-sys-danger">{errors.deadline}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
                <SectionHeading
                    icon={<Users size={20} />}
                    title="Project members"
                    description="Select the people who should work on this project."
                />

                <div className="space-y-2">
                    {membersLoading ? (
                        <p className="text-sm text-brand-muted">
                            Loading team members...
                        </p>
                    ) : membersError ? (
                        <p role="alert" className="text-sm text-sys-danger">
                            {membersError}
                        </p>
                    ) : members.length === 0 ? (
                        <p className="text-sm text-brand-muted">
                            No users found.
                        </p>
                    ) : (
                        members.map((member) => (
                            <label
                                key={member.id}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition hover:bg-hover-background"
                            >
                                <input
                                    type="checkbox"
                                    checked={values.memberIds.includes(member.id)}
                                    onChange={() => toggleMember(member.id)}
                                    className="h-4 w-4 accent-[var(--primary)]"
                                />

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-beige text-xs font-bold text-brand-primary">
                                    {member.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-brand-muted">
                                        {member.email}
                                    </p>
                                </div>

                                <span className="hidden text-xs capitalize text-brand-muted sm:inline">
                                    {member.role.toLowerCase().replaceAll("_", " ")}
                                </span>
                            </label>
                        ))
                    )}
                </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialProject ? "Save changes" : "Create project"}
                </Button>
            </div>
        </form>
    );
}

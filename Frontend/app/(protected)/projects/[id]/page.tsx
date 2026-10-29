
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Pencil, Archive, Users, ListTodo } from "lucide-react";
import Button from "@/components/ui/Button";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types/project.types";

export default function ProjectDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [archiving, setArchiving] = useState(false);

    useEffect(() => {
        async function loadProject() {
            try {
                setError("");
                const result = await projectService.getById(id);
                setProject(result);
            } catch (err) {
                console.error("Load project failed:", err);
                setError("Unable to load this project. It may not exist or you may not have access.");
            } finally {
                setLoading(false);
            }
        }

        if (id) loadProject();
    }, [id]);

    async function handleArchive() {
        if (!project || !window.confirm(`Archive "${project.name}"?`)) return;

        try {
            setArchiving(true);
            await projectService.archive(project.id);
            router.push("/projects");
            router.refresh();
        } catch (err) {
            console.error("Archive project failed:", err);
            setError("Unable to archive this project.");
        } finally {
            setArchiving(false);
        }
    }

    if (loading) {
        return <main className="p-8 text-sm text-brand-muted">Loading project...</main>;
    }

    if (error || !project) {
        return (
            <main className="mx-auto max-w-3xl p-6">
                <p role="alert" className="mb-5 text-sm text-sys-danger">
                    {error || "Project not found."}
                </p>
                <Button variant="outline" onClick={() => router.push("/projects")}>
                    <ArrowLeft size={16} /> Back to projects
                </Button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <Button variant="outline" onClick={() => router.push("/projects")}>
                    <ArrowLeft size={16} /> Back to projects
                </Button>

                {error && (
                    <p role="alert" className="text-sm text-sys-danger">{error}</p>
                )}

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div className="min-w-0">
                            <p className="text-sm text-brand-muted">Project details</p>
                            <h1 className="mt-2 break-words text-3xl font-bold text-foreground">
                                {project.name}
                            </h1>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-brand-muted">
                                {project.description || "No description provided."}
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            <Button
                                onClick={() => router.push(`/projects/${project.id}/edit`)}
                            >
                                <Pencil size={16} /> Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleArchive}
                                loading={archiving}
                            >
                                <Archive size={16} /> Archive
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Info
                            icon={<ListTodo size={18} />}
                            label="Priority"
                            value={project.priority}
                        />
                        <Info
                            icon={<CalendarDays size={18} />}
                            label="Deadline"
                            value={
                                project.deadline
                                    ? new Date(project.deadline).toLocaleDateString()
                                    : "Not set"
                            }
                        />
                        <Info
                            icon={<Users size={18} />}
                            label="Team members"
                            value={String(project.members.length)}
                        />
                        <Info
                            icon={<ListTodo size={18} />}
                            label="Tasks"
                            value={String(project.taskCount)}
                        />
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="font-semibold text-foreground">Project team</h2>

                    {project.members.length === 0 ? (
                        <p className="mt-3 text-sm text-brand-muted">
                            No member details are available for this project.
                        </p>
                    ) : (
                        <ul className="mt-4 divide-y divide-border">
                            {project.members.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <span className="font-medium text-foreground">{member.name}</span>
                                    <span className="text-sm text-brand-muted">{member.email}</span>
                                    <span className="text-xs text-brand-muted">{member.role}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <p className="text-xs text-brand-muted">
                    Created{" "}
                    {project.createdAt
                        ? new Date(project.createdAt).toLocaleString()
                        : "date unavailable"}
                </p>
            </div>
        </main>
    );
}

function Info({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-muted-background p-4">
            <div className="flex items-center gap-2 text-brand-muted">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="mt-2 break-words text-sm font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}


"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import { projectService } from "@/services/project.service";
import type { Project, ProjectPriority } from "@/types/project.types";

export default function EditProjectPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;

    const [project, setProject] = useState<Project | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<ProjectPriority>("MEDIUM");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProject() {
            try {
                const data = await projectService.getById(id);
                setProject(data);
                setName(data.name);
                setDescription(data.description);
                setPriority(data.priority);
                setDeadline(
                    data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : "",
                );
            } catch (err) {
                console.error("Load project failed:", err);
                setError("Unable to load this project.");
            } finally {
                setLoading(false);
            }
        }

        if (id) loadProject();
    }, [id]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!name.trim() || !description.trim()) {
            setError("Project name and description are required.");
            return;
        }

        try {
            setSaving(true);

            await projectService.update(id, {
                name: name.trim(),
                description: description.trim(),
                priority,
                deadline: deadline
                    ? new Date(`${deadline}T00:00:00`).toISOString()
                    : null,
            });

            router.push(`/projects/${id}`);
            router.refresh();
        } catch (err) {
            console.error("Update project failed:", err);
            setError("Unable to update the project. Check your permissions and try again.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <main className="p-8 text-sm text-brand-muted">Loading project...</main>;
    }

    if (!project) {
        return (
            <main className="p-6">
                <p role="alert" className="mb-4 text-sm text-sys-danger">
                    {error || "Project not found."}
                </p>
                <Button variant="outline" onClick={() => router.push("/projects")}>
                    <ArrowLeft size={16} /> Back to projects
                </Button>
            </main>
        );
    }

    const fieldClass =
        "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10";

    return (
        <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/projects/${id}`)}
                    className="mb-6"
                >
                    <ArrowLeft size={16} /> Back to project
                </Button>

                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <h1 className="text-2xl font-bold text-foreground">Edit project</h1>
                    <p className="mt-2 text-sm text-brand-muted">
                        Update the project details below.
                    </p>

                    {error && (
                        <p role="alert" className="mt-5 rounded-xl bg-sys-danger-bg p-3 text-sm text-sys-danger">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                                Project name
                            </label>
                            <input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={150}
                                required
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="text-sm font-medium text-foreground">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                maxLength={5000}
                                rows={5}
                                required
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="priority" className="text-sm font-medium text-foreground">
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(event) => setPriority(event.target.value as ProjectPriority)}
                                className={fieldClass}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="deadline" className="text-sm font-medium text-foreground">
                                Deadline
                            </label>
                            <input
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(event) => setDeadline(event.target.value)}
                                className={fieldClass}
                            />
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/projects/${id}`)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" loading={saving}>
                                <Save size={16} /> Save changes
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}

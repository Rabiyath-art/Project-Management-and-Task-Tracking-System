
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus } from "lucide-react";

import Button from "@/components/ui/Button";
import ProjectForm from "@/components/projects/ProjectForm";
import { projectService } from "@/services/project.service";
import type { ProjectFormValues } from "@/types/project.types";

export default function NewProjectPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleCreate(values: ProjectFormValues) {
        try {
            setSaving(true);
            setError("");

            const project = await projectService.create({
                name: values.name,
                description: values.description,
                priority: values.priority,
                deadline: values.deadline
                    ? new Date(`${values.deadline}T00:00:00.000Z`).toISOString()
                    : null,
            });

            router.push(`/projects/${project.id}`);
        } catch (err) {
            console.error("Create project failed:", err);
            setError("Unable to create project. Check your permissions and try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <Button variant="outline" onClick={() => router.push("/projects")}>
                    <ArrowLeft size={17} />
                    Back to projects
                </Button>

                <div>
                    <div className="flex items-center gap-3">
                        <FolderPlus size={26} className="text-brand-primary" />
                        <h1 className="text-2xl font-bold text-foreground">
                            Create project
                        </h1>
                    </div>
                    <p className="mt-2 text-sm text-brand-muted">
                        Set up a project and organize your work.
                    </p>
                </div>

                {error && (
                    <p role="alert" className="rounded-xl bg-sys-danger-bg p-3 text-sm text-sys-danger">
                        {error}
                    </p>
                )}

                <ProjectForm
                    onSubmit={handleCreate}
                    onCancel={() => router.push("/projects")}
                    submitting={saving}
                />
            </div>
        </main>
    );
}

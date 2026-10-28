"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectForm from "@/components/projects/ProjectForm";
import type { ProjectFormValues } from "@/types/project.types";

export default function NewProjectPage() {
    const router = useRouter();

    function handleCreate(values: ProjectFormValues) {
        router.push("/projects");
    }

    return (
        <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                <Button variant="outline" onClick={() => router.push("/projects")} className="mb-6">
                    <ArrowLeft size={16} />
                    Back to projects
                </Button>

                <div className="mb-7 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white">
                        <FolderPlus size={23} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Create a project
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-brand-muted">
                            Define the project details, timeline, priority, and team members.
                        </p>
                    </div>
                </div>

                <ProjectForm onSubmit={handleCreate} onCancel={() => router.push("/projects")}
                />
            </div>
        </main>
    );
}


// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, FolderPlus } from "lucide-react";

// import Button from "@/components/ui/Button";
// import ProjectForm from "@/components/projects/ProjectForm";
// import { projectService } from "@/services/project.service";
// import type { CreateProjectRequest } from "@/types/project.types";

// export default function NewProjectPage() {
//     const router = useRouter();

//     async function handleCreate(data: CreateProjectRequest) {
//         try {
//             await projectService.create(data);
//             router.push("/projects");
//         } catch (error) {
//             const message =
//                 (error as { response?: { data?: { message?: string } } })?.response
//                     ?.data?.message;

//             throw new Error(message || "Could not create the project.");
//         }
//     }

//     return (
//         <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-3xl">
//                 <Link
//                     href="/projects"
//                     className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
//                 >
//                     <ArrowLeft size={16} />
//                     Back to projects
//                 </Link>

//                 <header className="mb-6 mt-6">
//                     <div className="flex items-center gap-3">
//                         <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
//                             <FolderPlus size={23} />
//                         </span>
//                         <div>
//                             <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//                                 Create project
//                             </h1>
//                             <p className="mt-1 text-sm text-slate-500">
//                                 Define the project details to get your team started.
//                             </p>
//                         </div>
//                     </div>
//                 </header>

//                 <ProjectForm
//                     onSubmit={handleCreate}
//                     submitLabel="Create project"
//                 />
//             </div>
//         </main>
//     );
// }


"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectForm from "@/components/projects/ProjectForm";
import type { ProjectFormValues } from "@/types/project.types";

export default function NewProjectPage() {
    const router = useRouter();

    function handleCreate(values: ProjectFormValues) {
        // UI-only for now: inspect the values while developing.
        console.log("Project form values:", values);

        // The API call will be added during backend integration.
        router.push("/projects");
    }

    return (
        <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                <Button
                    variant="outline"
                    onClick={() => router.push("/projects")}
                    className="mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to projects
                </Button>

                <div className="mb-7 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                        <FolderPlus size={23} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Create a project
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Define the project details, timeline, priority, and team members.
                        </p>
                    </div>
                </div>

                <ProjectForm
                    onSubmit={handleCreate}
                    onCancel={() => router.push("/projects")}
                />
            </div>
        </main>
    );
}

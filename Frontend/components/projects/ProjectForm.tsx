
// "use client";

// import { useEffect, useState, type FormEvent } from "react";
// import { AlertCircle } from "lucide-react";

// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import type {
//     CreateProjectRequest,
//     Project,
//     ProjectPriority,
// } from "@/types/project.types";

// interface ProjectFormProps {
//     initialProject?: Project;
//     onSubmit: (data: CreateProjectRequest) => Promise<void>;
//     submitLabel: string;
// }

// export default function ProjectForm({
//     initialProject,
//     onSubmit,
//     submitLabel,
// }: ProjectFormProps) {
//     const [name, setName] = useState(initialProject?.name ?? "");
//     const [description, setDescription] = useState(
//         initialProject?.description ?? ""
//     );
//     const [priority, setPriority] = useState<ProjectPriority>(
//         initialProject?.priority ?? "MEDIUM"
//     );
//     const [deadline, setDeadline] = useState(
//         initialProject?.deadline
//             ? initialProject.deadline.slice(0, 10)
//             : ""
//     );
//     const [error, setError] = useState("");
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//         if (!initialProject) return;

//         setName(initialProject.name);
//         setDescription(initialProject.description ?? "");
//         setPriority(initialProject.priority);
//         setDeadline(initialProject.deadline?.slice(0, 10) ?? "");
//     }, [initialProject]);

//     async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//         event.preventDefault();
//         setError("");

//         const trimmedName = name.trim();

//         if (!trimmedName) {
//             setError("Project name is required.");
//             return;
//         }

//         if (trimmedName.length > 120) {
//             setError("Project name must be 120 characters or fewer.");
//             return;
//         }

//         if (deadline && deadline < new Date().toLocaleDateString("en-CA")) {
//             setError("Please select a future deadline.");
//             return;
//         }

//         setSubmitting(true);

//         try {
//             await onSubmit({
//                 name: trimmedName,
//                 description: description.trim(),
//                 priority,
//                 deadline: deadline || null,
//             });
//         } catch (err) {
//             setError(
//                 err instanceof Error
//                     ? err.message
//                     : "Unable to save the project. Please try again."
//             );
//         } finally {
//             setSubmitting(false);
//         }
//     }

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
//         >
//             {error && (
//                 <div
//                     role="alert"
//                     className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
//                 >
//                     <AlertCircle size={18} className="mt-0.5 shrink-0" />
//                     {error}
//                 </div>
//             )}

//             <Input
//                 label="Project name"
//                 name="name"
//                 value={name}
//                 onChange={(event) => setName(event.target.value)}
//                 placeholder="e.g. Customer Portal Redesign"
//                 maxLength={120}
//                 required
//             />

//             <div className="space-y-1.5">
//                 <label
//                     htmlFor="description"
//                     className="block text-sm font-medium text-slate-700"
//                 >
//                     Description
//                 </label>
//                 <textarea
//                     id="description"
//                     name="description"
//                     value={description}
//                     onChange={(event) => setDescription(event.target.value)}
//                     placeholder="Describe the project goals and expected outcome..."
//                     rows={5}
//                     maxLength={2000}
//                     className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                 />
//                 <p className="text-right text-xs text-slate-400">
//                     {description.length}/2000
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                 <div className="space-y-1.5">
//                     <label
//                         htmlFor="priority"
//                         className="block text-sm font-medium text-slate-700"
//                     >
//                         Priority
//                     </label>
//                     <select
//                         id="priority"
//                         value={priority}
//                         onChange={(event) =>
//                             setPriority(event.target.value as ProjectPriority)
//                         }
//                         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     >
//                         <option value="LOW">Low</option>
//                         <option value="MEDIUM">Medium</option>
//                         <option value="HIGH">High</option>
//                         <option value="URGENT">Urgent</option>
//                     </select>
//                 </div>

//                 <div className="space-y-1.5">
//                     <label
//                         htmlFor="deadline"
//                         className="block text-sm font-medium text-slate-700"
//                     >
//                         Deadline
//                     </label>
//                     <input
//                         id="deadline"
//                         type="date"
//                         value={deadline}
//                         onChange={(event) => setDeadline(event.target.value)}
//                         min={new Date().toLocaleDateString("en-CA")}
//                         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     />
//                 </div>
//             </div>

//             <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
//                 <Button
//                     type="submit"
//                     loading={submitting}
//                     disabled={submitting}
//                     className="sm:min-w-40"
//                 >
//                     {submitLabel}
//                 </Button>
//             </div>
//         </form>
//     );
// }

"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, FileText, FolderKanban, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { demoMembers } from "@/data/projects";
import type {
    Project,
    ProjectFormValues,
    ProjectPriority,
    ProjectStatus,
} from "@/types/project.types";

interface ProjectFormProps {
    initialProject?: Project;
    onSubmit: (values: ProjectFormValues) => void;
    onCancel: () => void;
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

export default function ProjectForm({
    initialProject,
    onSubmit,
    onCancel,
}: ProjectFormProps) {
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
            : defaultValues,
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

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

        if (values.deadline && values.startDate && values.deadline < values.startDate) {
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
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FolderKanban size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Project information
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Enter the essential details for this project.
                        </p>
                    </div>
                </div>

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
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>
                        <div className="relative">
                            <FileText
                                size={17}
                                className="absolute left-3 top-3 text-slate-400"
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
                                className="w-full resize-y rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <p className="text-right text-xs text-slate-400">
                            {values.description.length}/2000
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Project status
                            </label>
                            <select
                                id="status"
                                value={values.status}
                                onChange={(event) =>
                                    updateField("status", event.target.value as ProjectStatus)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="PLANNING">Planning</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="ON_HOLD">On hold</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="priority"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={values.priority}
                                onChange={(event) =>
                                    updateField("priority", event.target.value as ProjectPriority)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <CalendarDays size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">Project timeline</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Set the planned start and completion dates.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Start date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={values.startDate}
                            onChange={(event) => updateField("startDate", event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="deadline"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Deadline
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            min={values.startDate || undefined}
                            value={values.deadline}
                            onChange={(event) => updateField("deadline", event.target.value)}
                            aria-invalid={Boolean(errors.deadline)}
                            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 ${errors.deadline
                                    ? "border-red-400 focus:ring-red-100"
                                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                                }`}
                        />
                        {errors.deadline && (
                            <p className="text-xs text-red-600">{errors.deadline}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">Project members</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Select the people who should work on this project.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    {demoMembers.map((member) => (
                        <label
                            key={member.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                        >
                            <input
                                type="checkbox"
                                checked={values.memberIds.includes(member.id)}
                                onChange={() => toggleMember(member.id)}
                                className="h-4 w-4 accent-indigo-600"
                            />

                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${member.avatarColor ?? "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {member.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-800">
                                    {member.name}
                                </p>
                                <p className="text-xs text-slate-500">{member.email}</p>
                            </div>

                            <span className="hidden text-xs capitalize text-slate-500 sm:inline">
                                {member.role.toLowerCase().replaceAll("_", " ")}
                            </span>
                        </label>
                    ))}
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


// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import {
//     AlertCircle,
//     FolderKanban,
//     Plus,
//     RefreshCw,
//     Search,
// } from "lucide-react";

// import Button from "@/components/ui/Button";
// import EmptyState from "@/components/ui/EmptyState";
// import ProjectCard from "@/components/projects/ProjectCard";
// import { projectService } from "@/services/project.service";
// import type {
//     Project,
//     ProjectPriority,
//     ProjectStatus,
// } from "@/types/project.types";

// type UserRole = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState<Project[]>([]);
//     const [search, setSearch] = useState("");
//     const [priority, setPriority] = useState("");
//     const [status, setStatus] = useState("");
//     const [showArchived, setShowArchived] = useState(false);

//     const [role, setRole] = useState<UserRole | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [actionError, setActionError] = useState("");
//     const [archivingId, setArchivingId] = useState<string | null>(null);

//     const canManage = role === "ADMIN" || role === "PROJECT_MANAGER";

//     useEffect(() => {
//         try {
//             const storedUser = localStorage.getItem("user");

//             if (storedUser) {
//                 const user = JSON.parse(storedUser) as { role?: UserRole };
//                 setRole(user.role ?? null);
//             }
//         } catch {
//             setRole(null);
//         }
//     }, []);

//     const loadProjects = useCallback(async () => {
//         setLoading(true);
//         setError("");

//         try {
//             const result = await projectService.getAll({
//                 search: search.trim() || undefined,
//                 priority: priority || undefined,
//                 status: status || undefined,
//             });

//             setProjects(result.projects ?? []);
//         } catch {
//             setError("Unable to load projects. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     }, [search, priority, status]);

//     useEffect(() => {
//         const timer = window.setTimeout(() => {
//             void loadProjects();
//         }, 250);

//         return () => window.clearTimeout(timer);
//     }, [loadProjects]);

//     async function handleArchive(project: Project) {
//         const confirmed = window.confirm(
//             `Archive "${project.name}"? You can no longer treat it as an active project.`
//         );

//         if (!confirmed) return;

//         setArchivingId(project.id);
//         setActionError("");

//         try {
//             await projectService.archive(project.id);
//             await loadProjects();
//         } catch {
//             setActionError(
//                 "Could not archive this project. Check your permissions and try again."
//             );
//         } finally {
//             setArchivingId(null);
//         }
//     }

//     const visibleProjects = projects.filter((project) =>
//         showArchived
//             ? project.status === "ARCHIVED"
//             : project.status !== "ARCHIVED"
//     );

//     return (
//         <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-7xl">
//                 <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//                     <div>
//                         <div className="flex items-center gap-2 text-sm text-slate-500">
//                             <FolderKanban size={16} />
//                             Workspace / Projects
//                         </div>

//                         <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                             Projects
//                         </h1>

//                         <p className="mt-2 text-sm text-slate-500">
//                             Organize projects, manage team members, and track progress.
//                         </p>
//                     </div>

//                     {canManage && (
//                         <Link href="/projects/new">
//                             <Button>
//                                 <Plus size={17} />
//                                 Create project
//                             </Button>
//                         </Link>
//                     )}
//                 </header>

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
//                     <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
//                         <div className="relative md:col-span-2">
//                             <Search
//                                 size={18}
//                                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                             />
//                             <input
//                                 value={search}
//                                 onChange={(event) => setSearch(event.target.value)}
//                                 placeholder="Search projects..."
//                                 aria-label="Search projects"
//                                 className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                             />
//                         </div>

//                         <select
//                             value={priority}
//                             onChange={(event) => setPriority(event.target.value)}
//                             aria-label="Filter by priority"
//                             className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                         >
//                             <option value="">All priorities</option>
//                             <option value="LOW">Low</option>
//                             <option value="MEDIUM">Medium</option>
//                             <option value="HIGH">High</option>
//                             <option value="URGENT">Urgent</option>
//                         </select>

//                         <select
//                             value={status}
//                             onChange={(event) => setStatus(event.target.value)}
//                             aria-label="Filter by status"
//                             className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                         >
//                             <option value="">All statuses</option>
//                             <option value="PLANNING">Planning</option>
//                             <option value="ACTIVE">Active</option>
//                             <option value="ON_HOLD">On hold</option>
//                             <option value="COMPLETED">Completed</option>
//                             <option value="ARCHIVED">Archived</option>
//                         </select>
//                     </div>

//                     <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//                         <label className="flex items-center gap-2 text-sm text-slate-600">
//                             <input
//                                 type="checkbox"
//                                 checked={showArchived}
//                                 onChange={(event) =>
//                                     setShowArchived(event.target.checked)
//                                 }
//                                 className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
//                             />
//                             Show archived projects only
//                         </label>

//                         <Button variant="outline" onClick={() => void loadProjects()}>
//                             <RefreshCw size={15} />
//                             Refresh
//                         </Button>
//                     </div>
//                 </section>

//                 {actionError && (
//                     <div
//                         role="alert"
//                         className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
//                     >
//                         <AlertCircle size={18} />
//                         {actionError}
//                     </div>
//                 )}

//                 <section className="mt-6">
//                     {loading ? (
//                         <div
//                             className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
//                             aria-label="Loading projects"
//                         >
//                             {Array.from({ length: 6 }).map((_, index) => (
//                                 <div
//                                     key={index}
//                                     className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
//                                 />
//                             ))}
//                         </div>
//                     ) : error ? (
//                         <div
//                             role="alert"
//                             className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
//                         >
//                             <p className="font-semibold text-red-800">{error}</p>
//                             <button
//                                 type="button"
//                                 onClick={() => void loadProjects()}
//                                 className="mt-3 text-sm font-semibold text-red-700 underline"
//                             >
//                                 Try again
//                             </button>
//                         </div>
//                     ) : visibleProjects.length === 0 ? (
//                         <EmptyState
//                             title={
//                                 showArchived
//                                     ? "No archived projects"
//                                     : "No projects found"
//                             }
//                             description={
//                                 search || priority || status
//                                     ? "Try changing your search or filters."
//                                     : "Create a project to start organizing work and assigning team members."
//                             }
//                             action={
//                                 canManage && !showArchived ? (
//                                     <Link href="/projects/new">
//                                         <Button>
//                                             <Plus size={17} />
//                                             Create project
//                                         </Button>
//                                     </Link>
//                                 ) : undefined
//                             }
//                         />
//                     ) : (
//                         <>
//                             <div className="mb-4 flex items-center justify-between">
//                                 <p className="text-sm text-slate-500">
//                                     {visibleProjects.length} project
//                                     {visibleProjects.length === 1 ? "" : "s"}
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//                                 {visibleProjects.map((project) => (
//                                     <div key={project.id} className="relative">
//                                         <ProjectCard
//                                             project={project}
//                                             canManage={canManage}
//                                             onArchive={handleArchive}
//                                         />
//                                         {archivingId === project.id && (
//                                             <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 text-sm font-medium text-slate-700">
//                                                 Archiving...
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </>
//                     )}
//                 </section>
//             </div>
//         </main>
//     );
// }

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Archive,
    ArrowDownUp,
    BriefcaseBusiness,
    CheckCircle2,
    CirclePlus,
    FolderKanban,
    LayoutGrid,
    List,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/projects/ProjectCard";
import { initialProjects } from "@/data/projects";
import type {
    Project,
    ProjectStatus,
} from "@/types/project.types";

type StatusFilter = "ALL" | ProjectStatus;

export default function ProjectsPage() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [showArchived, setShowArchived] = useState(false);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [archiveTarget, setArchiveTarget] = useState<Project | null>(null);

    const activeProjects = projects.filter((project) => !project.archived);
    const archivedProjects = projects.filter((project) => project.archived);

    const visibleProjects = useMemo(() => {
        const source = showArchived ? archivedProjects : activeProjects;

        return source.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(search.toLowerCase()) ||
                project.description.toLowerCase().includes(search.toLowerCase()) ||
                project.id.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter, showArchived]);

    const completedCount = activeProjects.filter(
        (project) => project.status === "COMPLETED",
    ).length;

    const inProgressCount = activeProjects.filter(
        (project) => project.status === "IN_PROGRESS",
    ).length;

    function handleEdit(project: Project) {
        router.push(`/projects/${project.id}/edit`);
    }

    function confirmArchive() {
        if (!archiveTarget) return;

        setProjects((current) =>
            current.map((project) =>
                project.id === archiveTarget.id
                    ? { ...project, archived: !showArchived }
                    : project,
            ),
        );

        setArchiveTarget(null);
    }

    return (
        <main className="min-h-screen bg-slate-50/70">
            <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <BriefcaseBusiness size={16} />
                            Workspace
                            <span>/</span>
                            <span className="font-medium text-slate-800">Projects</span>
                        </div>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Project management
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Organize projects, manage team members, and track progress.
                        </p>
                    </div>

                    <Button onClick={() => router.push("/projects/new")}>
                        <CirclePlus size={18} />
                        New project
                    </Button>
                </div>

                {/* Summary cards */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Active projects"
                        value={activeProjects.length}
                        icon={<FolderKanban size={20} />}
                        iconClass="bg-indigo-50 text-indigo-600"
                        detail="Projects in your workspace"
                    />

                    <SummaryCard
                        title="In progress"
                        value={inProgressCount}
                        icon={<ArrowDownUp size={20} />}
                        iconClass="bg-blue-50 text-blue-600"
                        detail="Currently being worked on"
                    />

                    <SummaryCard
                        title="Completed"
                        value={completedCount}
                        icon={<CheckCircle2 size={20} />}
                        iconClass="bg-emerald-50 text-emerald-600"
                        detail="Successfully completed"
                    />

                    <SummaryCard
                        title="Archived"
                        value={archivedProjects.length}
                        icon={<Archive size={20} />}
                        iconClass="bg-amber-50 text-amber-600"
                        detail="Projects set aside"
                    />
                </section>

                {/* Project toolbar */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-4 sm:p-5">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    {showArchived ? "Archived projects" : "All projects"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {visibleProjects.length}{" "}
                                    {visibleProjects.length === 1 ? "project" : "projects"} found
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative min-w-0 sm:w-72">
                                    <Search
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search projects..."
                                        aria-label="Search projects"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex min-w-0 flex-1 items-center sm:flex-none">
                                        <SlidersHorizontal
                                            size={15}
                                            className="pointer-events-none absolute left-3 text-slate-400"
                                        />
                                        <select
                                            value={statusFilter}
                                            onChange={(event) =>
                                                setStatusFilter(event.target.value as StatusFilter)
                                            }
                                            aria-label="Filter by project status"
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-500 sm:w-auto"
                                        >
                                            <option value="ALL">All statuses</option>
                                            <option value="PLANNING">Planning</option>
                                            <option value="IN_PROGRESS">In progress</option>
                                            <option value="ON_HOLD">On hold</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>

                                    <div className="flex rounded-xl border border-slate-200 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setView("grid")}
                                            aria-label="Grid view"
                                            aria-pressed={view === "grid"}
                                            className={`rounded-lg p-2 ${view === "grid"
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-slate-400 hover:text-slate-700"
                                                }`}
                                        >
                                            <LayoutGrid size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setView("list")}
                                            aria-label="List view"
                                            aria-pressed={view === "list"}
                                            className={`rounded-lg p-2 ${view === "list"
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-slate-400 hover:text-slate-700"
                                                }`}
                                        >
                                            <List size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowArchived(false)}
                                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${!showArchived
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                Active projects
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowArchived(true)}
                                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${showArchived
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                Archived ({archivedProjects.length})
                            </button>
                        </div>
                    </div>

                    {/* Project results */}
                    <div className="p-4 sm:p-5">
                        {visibleProjects.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    <FolderKanban size={25} />
                                </div>

                                <h3 className="mt-4 font-semibold text-slate-900">
                                    {search || statusFilter !== "ALL"
                                        ? "No matching projects"
                                        : showArchived
                                            ? "No archived projects yet"
                                            : "No projects yet"}
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    {search || statusFilter !== "ALL"
                                        ? "Try changing your search or status filter."
                                        : "Create a project to organize work, assign members, and track progress."}
                                </p>

                                {(search || statusFilter !== "ALL") && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => {
                                            setSearch("");
                                            setStatusFilter("ALL");
                                        }}
                                    >
                                        <X size={16} />
                                        Clear filters
                                    </Button>
                                )}

                                {!showArchived &&
                                    !search &&
                                    statusFilter === "ALL" && (
                                        <Button
                                            className="mt-4"
                                            onClick={() => router.push("/projects/new")}
                                        >
                                            <CirclePlus size={17} />
                                            Create project
                                        </Button>
                                    )}
                            </div>
                        ) : (
                            <div
                                className={
                                    view === "grid"
                                        ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                                        : "flex flex-col gap-4"
                                }
                            >
                                {visibleProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onEdit={handleEdit}
                                        onArchive={setArchiveTarget}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Archive confirmation */}
            {archiveTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setArchiveTarget(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="archive-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Archive size={23} />
                        </div>

                        <h2
                            id="archive-title"
                            className="mt-4 text-lg font-bold text-slate-900"
                        >
                            {showArchived ? "Restore project?" : "Archive project?"}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {showArchived
                                ? `Restore "${archiveTarget.name}" to active projects?`
                                : `Archive "${archiveTarget.name}"? It will move out of your active project list. This does not permanently delete it.`}
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setArchiveTarget(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant={showArchived ? "primary" : "danger"}
                                onClick={confirmArchive}
                            >
                                {showArchived ? "Restore project" : "Archive project"}
                            </Button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

function SummaryCard({
    title,
    value,
    icon,
    iconClass,
    detail,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    detail: string;
}) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                    {icon}
                </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{detail}</p>
        </article>
    );
}

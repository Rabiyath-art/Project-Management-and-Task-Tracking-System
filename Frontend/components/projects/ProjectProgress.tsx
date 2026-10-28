
interface ProjectProgressProps {
    value: number;
    completedTasks?: number;
    totalTasks?: number;
    showLabel?: boolean;
}

export default function ProjectProgress({
    value,
    completedTasks,
    totalTasks,
    showLabel = true,
}: ProjectProgressProps) {
    const progress = Math.min(100, Math.max(0, value));

    return (
        <div className="w-full">
            {showLabel && (
                <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-600">Progress</span>
                    <span className="font-semibold tabular-nums text-slate-900">
                        {progress}%
                    </span>
                </div>
            )}

            <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Project progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
            >
                <div
                    className={`h-full rounded-full transition-all ${progress === 100 ? "bg-emerald-500" : "bg-indigo-600"
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {completedTasks !== undefined && totalTasks !== undefined && (
                <p className="mt-2 text-xs text-slate-500">
                    {completedTasks} of {totalTasks} tasks completed
                </p>
            )}
        </div>
    );
}

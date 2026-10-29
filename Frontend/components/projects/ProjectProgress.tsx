interface ProjectProgressProps {
    value: number;
    completedTasks?: number;
    totalTasks?: number;
    showLabel?: boolean;
}

export default function ProjectProgress({ value, completedTasks, totalTasks, showLabel = true,
}: ProjectProgressProps) {
    const progress = Math.min(100, Math.max(0, value));

    return (
        <div className="w-full">
            {showLabel && (
                <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-brand-muted">Progress</span>
                    <span className="font-semibold tabular-nums text-foreground">
                        {progress}%
                    </span>
                </div>
            )}

            <div
                className="h-2 overflow-hidden rounded-full bg-muted-background"
                role="progressbar"
                aria-label="Project progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
            >
                <div
                    className={`h-full rounded-full transition-all duration-300 ${progress === 100 ? "bg-sys-success" : "bg-brand-primary"
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {completedTasks !== undefined && totalTasks !== undefined && (
                <p className="mt-2 text-xs text-brand-muted">
                    {completedTasks} of {totalTasks} tasks completed
                </p>
            )}
        </div>
    );
}

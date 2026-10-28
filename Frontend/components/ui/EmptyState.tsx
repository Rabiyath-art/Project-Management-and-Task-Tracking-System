
import type { ReactNode } from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    action?: ReactNode;
}

export default function EmptyState({
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FolderOpen size={27} />
            </div>

            <h3 className="text-base font-semibold text-slate-900">{title}</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {description}
            </p>

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

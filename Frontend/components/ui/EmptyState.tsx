
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-beige text-brand-primary">
                <FolderOpen size={27} />
            </div>

            <h3 className="text-base font-semibold text-foreground">{title}</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-brand-muted">
                {description}
            </p>

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

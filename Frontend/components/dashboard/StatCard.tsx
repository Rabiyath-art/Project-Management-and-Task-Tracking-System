
import type { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: ReactNode;
    iconClassName?: string;
}

export default function StatCard({
    title,
    value,
    description,
    icon,
    iconClassName = "bg-indigo-50 text-indigo-600",
}: StatCardProps) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
                >
                    {icon}
                </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">{description}</p>
        </article>
    );
}

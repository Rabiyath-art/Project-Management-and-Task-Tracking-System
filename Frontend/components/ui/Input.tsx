
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: ReactNode;
}

export default function Input({
    label,
    error,
    icon,
    id,
    className = "",
    ...props
}: InputProps) {
    const inputId = id ?? props.name;

    return (
        <div className="w-full space-y-1.5">
            <label
                htmlFor={inputId}
                className="block text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                        {icon}
                    </span>
                )}

                <input
                    id={inputId}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={[
                        "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900",
                        "placeholder:text-slate-400 focus:outline-none focus:ring-2",
                        icon ? "pl-10" : "",
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100",
                        className,
                    ].join(" ")}
                    {...props}
                />
            </div>

            {error && (
                <p id={`${inputId}-error`} className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

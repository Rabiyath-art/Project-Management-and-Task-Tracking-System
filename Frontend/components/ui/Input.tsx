
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
                className="block text-sm font-medium text-foreground"
            >
                {label}
            </label>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-brand-muted">
                        {icon}
                    </span>
                )}

                <input
                    id={inputId}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={[
                        "w-full rounded-xl border bg-card px-3 py-2.5 text-sm text-foreground",
                        "placeholder:text-brand-muted outline-none transition",
                        "focus-visible:ring-2 focus-visible:ring-brand-primary/10",
                        icon ? "pl-10" : "",
                        error
                            ? "border-sys-danger focus:border-sys-danger focus-visible:ring-sys-danger/10"
                            : "border-border focus:border-brand-primary",
                        className,
                    ].join(" ")}
                    {...props}
                />
            </div>

            {error && (
                <p id={`${inputId}-error`} className="text-xs text-sys-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

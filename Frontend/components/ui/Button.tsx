
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
    fullWidth?: boolean;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
    secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400",
    outline:
        "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-indigo-500",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

export default function Button({
    variant = "primary",
    loading = false,
    fullWidth = false,
    disabled,
    children,
    className = "",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5",
                "text-sm font-semibold transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
                variantStyles[variant],
                fullWidth ? "w-full" : "",
                className,
            ].join(" ")}
            {...props}
        >
            {loading && <LoaderCircle size={17} className="animate-spin" />}
            {children}
        </button>
    );
}

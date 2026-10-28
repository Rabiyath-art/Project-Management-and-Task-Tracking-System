
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
        "bg-brand-primary text-white hover:bg-brand-hover focus-visible:ring-brand-primary",
    secondary:
        "bg-brand-beige text-brand-primary hover:bg-brand-beige/70 focus-visible:ring-brand-primary",
    outline:
        "border border-border bg-card text-foreground hover:bg-hover-background focus-visible:ring-brand-primary",
    danger:
        "bg-sys-danger text-white hover:bg-sys-danger/90 focus-visible:ring-sys-danger",
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

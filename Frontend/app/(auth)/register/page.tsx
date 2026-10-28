"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound, } from "lucide-react";
import { authService } from "@/services/auth.service";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const passwordValid = password.length >= 8;
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

    const fieldClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (!passwordValid) {
            setError("Your password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const result = await authService.register({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (result.token) {
                localStorage.setItem("token", result.token);

                if (result.user) {
                    localStorage.setItem("user", JSON.stringify(result.user));
                }

                router.replace("/");
            } else {
                router.replace("/login?registered=1");
            }
        } catch (err: unknown) {
            const message = typeof err === "object" && err !== null && "response" in err ? (err as {
                response?: { data?: { message?: string } };
            }).response?.data?.message : undefined;
            setError(message || "Unable to create your account. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <header className="flex h-[76px] items-center justify-between border-b border-border bg-card px-5 sm:px-10">
                <Link href="/login" className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-lg font-semibold text-white">
                        P
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                        ProjectFlow
                    </span>
                </Link>

                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition hover:text-brand-primary"
                >
                    <ArrowLeft size={16} />
                    Sign in
                </Link>
            </header>

            <section className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-10 sm:px-10 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-20">
                <div className="pt-2 lg:sticky lg:top-12">
                    <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-brand-muted">
                        <span className="h-2 w-2 rounded-full bg-brand-primary" />
                        ACCOUNT SETUP
                    </p>

                    <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl xl:text-5xl">
                        Make room for better work.
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-7 text-brand-muted">
                        Create your account to organise projects, manage tasks, and keep
                        your team aligned from one workspace.
                    </p>

                    <div className="mt-9 space-y-4 border-t border-border pt-6">
                        {[
                            "Keep project work organised",
                            "Know who owns each task",
                            "Follow progress and deadlines",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-beige text-brand-primary">
                                    <Check size={14} />
                                </span>
                                <span className="text-sm text-foreground">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 hidden border-l-2 border-brand-primary pl-4 lg:block">
                        <p className="text-sm font-medium text-foreground">
                            One workspace. Clear ownership.
                        </p>
                        <p className="mt-1 text-xs leading-5 text-brand-muted">
                            A calmer way to plan, collaborate, and deliver.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:p-9">
                    <div className="mb-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                            Get started
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-brand-muted">
                            Enter your details below to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                                Full name
                            </label>
                            <div className="relative">
                                <UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                <input id="name" name="name" type="text" autoComplete="name" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} required className={`${fieldClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                                />
                                <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required
                                    className={`${fieldClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required
                                    className={`${fieldClass} pl-10 pr-12`}
                                />
                                <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted transition hover:text-brand-primary"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-brand-muted">
                                Use at least 8 characters.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                                Confirm password
                            </label>
                            <div className="relative">
                                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required
                                    className={`${fieldClass} pl-10 pr-12`}
                                />
                                {passwordsMatch && (
                                    <Check size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sys-success" />
                                )}
                            </div>
                        </div>

                        {error && (
                            <div role="alert" className="rounded-xl border border-sys-danger/20 bg-sys-danger-bg px-4 py-3 text-sm text-sys-danger" >
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth loading={loading} className="!rounded-xl !py-3">
                            {loading ? "Creating account..." : "Create account"}
                            {!loading && <ArrowUpRight size={17} />}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-brand-muted">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-brand-primary transition hover:underline" >
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>

            <footer className="border-t border-border px-5 py-5 text-center text-xs text-brand-muted">
                © 2026 ProjectFlow. Built for focused teamwork.
            </footer>
        </main>
    );
}


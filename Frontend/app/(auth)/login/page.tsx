"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, LockKeyhole, Mail, } from "lucide-react";
import { authService } from "@/services/auth.service";
import Button from "@/components/ui/Button";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Enter your email address and password.");
            return;
        }

        setLoading(true);

        try {
            const result = await authService.login({
                email: email.trim(),
                password,
            });

            if (!result.token) {
                setError("The server did not return an authentication token.");
                return;
            }

            localStorage.setItem("token", result.token);

            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            router.replace("/");
        } catch (err: unknown) {
            const message =
                typeof err === "object" && err !== null && "response" in err
                    ? (
                        err as {
                            response?: { data?: { message?: string } };
                        }
                    ).response?.data?.message
                    : undefined;

            setError(message || "Sign-in failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    const fieldClass =
        "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10";

    return (
        <main className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-primary p-10 text-white lg:flex xl:p-14">
                <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full border border-white/10" />
                <div className="absolute -right-12 top-[38%] h-48 w-48 rounded-full border border-white/10" />

                <Link href="/login" className="relative z-10 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-lg font-semibold">
                        P
                    </span>
                    <span className="text-lg font-semibold tracking-tight">
                        ProjectFlow
                    </span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                        Your team's workspace
                    </p>

                    <h2 className="text-4xl font-semibold leading-[1.15] tracking-tight xl:text-5xl">
                        Good work begins with a clear plan.
                    </h2>

                    <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
                        Keep projects moving, make ownership clear, and bring everyday
                        team collaboration into one organised space.
                    </p>

                    <div className="mt-10 border-t border-white/20 pt-5">
                        <p className="text-xs uppercase tracking-wider text-white/50">
                            Plan clearly. Work confidently.
                        </p>
                    </div>
                </div>

                <p className="relative z-10 text-xs text-white/50">
                    © 2026 ProjectFlow
                </p>
            </aside>

            <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
                <div className="w-full max-w-[420px]">
                    <Link
                        href="/login"
                        className="mb-12 inline-flex items-center gap-3 lg:hidden"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-lg font-semibold text-white">
                            P
                        </span>
                        <span className="text-lg font-semibold text-foreground">
                            ProjectFlow
                        </span>
                    </Link>

                    <div className="mb-9">
                        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-brand-muted">
                            <span className="h-px w-7 bg-brand-primary" />
                            WORKSPACE ACCESS
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[34px]">
                            Welcome back.
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-brand-muted">
                            Sign in to pick up where your team left off.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                                />
                                <input id="email" name="email" type="email" autoComplete="email" placeholder="rabi@gmail.com" value={email} onChange={(event) => setEmail(event.target.value)} required
                                    className={`${fieldClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                            </div>

                            <div className="relative">
                                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required
                                    className={`${fieldClass} pl-10 pr-12`}
                                />
                                <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted transition hover:text-brand-primary"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div role="alert" className="rounded-xl border border-sys-danger/20 bg-sys-danger-bg px-4 py-3 text-sm text-sys-danger">
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth loading={loading} className="!rounded-xl !py-3">
                            {loading ? "Signing in..." : "Sign in to workspace"}
                            {!loading && <ArrowUpRight size={17} />}
                        </Button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-brand-muted">NEW TO PROJECTFLOW?</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <Link
                        href="/register"
                        className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:border-brand-primary hover:bg-hover-background"
                    >
                        Create an account
                    </Link>

                    <p className="mt-10 text-center text-xs leading-5 text-brand-muted">
                        By continuing, you agree to use this workspace responsibly.
                    </p>
                </div>
            </section>
        </main>
    );
}

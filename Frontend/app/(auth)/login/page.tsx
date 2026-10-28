
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Command, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { authService } from "@/services/auth.service";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const result = await authService.login({
                email: email.trim(),
                password,
            });

            if (!result.token) {
                setError("Login succeeded, but no token was returned by the server.");
                return;
            }

            localStorage.setItem("token", result.token);

            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            router.replace("/");
        } catch (err: unknown) {
            const message =
                typeof err === "object" &&
                    err !== null &&
                    "response" in err
                    ? (
                        err as {
                            response?: {
                                data?: { message?: string };
                            };
                        }
                    ).response?.data?.message
                    : undefined;

            setError(message || "Unable to sign in. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="grid min-h-screen bg-white lg:grid-cols-2">
            <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
                <div className="w-full max-w-[420px]">
                    <Link href="/" className="mb-12 inline-flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            <Command size={22} />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-950">
                            ProjectFlow
                        </span>
                    </Link>

                    <div className="mb-8">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                            Welcome back
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Sign in to your workspace
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Manage projects, collaborate with your team, and keep every task
                            moving forward.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email address
                            </label>
                            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                                <Mail size={18} className="text-slate-400" />
                                <Input
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    icon={<Mail size={17} />}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                            </div>

                            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                                <LockKeyhole size={18} className="text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="text-slate-400 transition hover:text-slate-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                            >
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth loading={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                            {!loading && <ArrowRight size={17} />}
                        </Button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                            Create account
                        </Link>
                    </p>

                    <p className="mt-12 text-center text-xs text-slate-400">
                        © 2026 ProjectFlow. All rights reserved.
                    </p>
                </div>
            </section>

            <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

                <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={17} className="text-indigo-400" />
                    Your work, organized.
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-indigo-200">
                        ONE WORKSPACE. CLEAR PROGRESS.
                    </div>
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                        Great work starts with a team that&apos;s in sync.
                    </h2>
                    <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
                        Bring projects, tasks, conversations, and progress together.
                        Spend less time chasing updates and more time getting work done.
                    </p>

                    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400">Workspace overview</p>
                                <p className="mt-1 text-sm font-semibold">Project progress</p>
                            </div>
                            <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                On track
                            </span>
                        </div>
                        <div className="mt-5 space-y-4">
                            {[
                                { name: "Website Redesign", progress: 78, color: "bg-indigo-400" },
                                { name: "Mobile Application", progress: 52, color: "bg-sky-400" },
                                { name: "CRM Dashboard", progress: 92, color: "bg-emerald-400" },
                            ].map((project) => (
                                <div key={project.name}>
                                    <div className="mb-2 flex justify-between text-xs">
                                        <span className="text-slate-300">{project.name}</span>
                                        <span className="text-slate-400">{project.progress}%</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className={`h-full rounded-full ${project.color}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="relative z-10 text-xs text-slate-500">
                    A clearer view of work. A better way to collaborate.
                </p>
            </section>
        </main>
    );
}

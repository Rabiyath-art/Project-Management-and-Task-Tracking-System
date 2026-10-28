
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Command,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
} from "lucide-react";
import { authService } from "@/services/auth.service";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
                router.replace("/auth/login?registered=1");
            }
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

            setError(
                message || "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="grid min-h-screen bg-white lg:grid-cols-2">
            <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
                <div className="w-full max-w-[430px]">
                    <Link href="/" className="mb-10 inline-flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            <Command size={22} />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-950">
                            ProjectFlow
                        </span>
                    </Link>

                    <div className="mb-7">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                            Get started
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Create your account
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Set up your account to organize projects and collaborate with
                            your team.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Full name
                            </label>
                            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                                <UserRound size={18} className="text-slate-400" />
                                <Input
                                    label="Full name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    icon={<UserRound size={17} />}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Work email
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
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                                <LockKeyhole size={18} className="text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="At least 8 characters"
                                    minLength={8}
                                    required
                                    className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="text-slate-400 hover:text-slate-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-1.5 text-[11px] text-slate-400">
                                Use at least 8 characters.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Confirm password
                            </label>
                            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                                <LockKeyhole size={18} className="text-slate-400" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Re-enter your password"
                                    required
                                    className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                />
                                {passwordsMatch && (
                                    <Check size={17} className="text-emerald-600" />
                                )}
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
                            {loading ? "Creating account..." : "Create account"}
                            {!loading && <ArrowRight size={17} />}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-10 text-center text-xs text-slate-400">
                        © 2026 ProjectFlow. All rights reserved.
                    </p>
                </div>
            </section>

            <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

                <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={17} className="text-indigo-400" />
                    A better way to work together
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                        Bring your projects and people together.
                    </h2>
                    <p className="mt-6 text-sm leading-7 text-slate-400">
                        Create a workspace where everyone knows what to do, what matters,
                        and what comes next.
                    </p>

                    <div className="mt-9 space-y-5">
                        {[
                            "Organize projects and deadlines",
                            "Assign tasks and track progress",
                            "Collaborate with comments and updates",
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                    <Check size={14} />
                                </span>
                                <span className="text-sm text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-xs text-slate-500">
                    Everything your team needs to make progress.
                </p>
            </section>
        </main>
    );
}

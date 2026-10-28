import { ShieldCheck, Users, UserRoundCheck, BriefcaseBusiness, } from "lucide-react";
import type { TeamMember } from "@/types/team.types";

export default function TeamSummary({ members, }: {
    members: TeamMember[];
}) {
    const summaries = [
        {
            label: "Total members",
            value: members.length,
            icon: Users,
        },
        {
            label: "Admins",
            value: members.filter((member) => member.role === "ADMIN").length,
            icon: ShieldCheck,
        },
        {
            label: "Project managers",
            value: members.filter((member) => member.role === "PROJECT_MANAGER")
                .length,
            icon: BriefcaseBusiness,
        },
        {
            label: "Active members",
            value: members.filter((member) => member.status === "ACTIVE").length,
            icon: UserRoundCheck,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaries.map((item) => {
                const Icon = item.icon;

                return (
                    <article key={item.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-brand-muted">
                                {item.label}
                            </p>
                            <span className="rounded-xl bg-brand-beige/60 p-2.5 text-brand-primary">
                                <Icon className="h-5 w-5" />
                            </span>
                        </div>
                        <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                            {item.value}
                        </p>
                    </article>
                );
            })}
        </div>
    );
}

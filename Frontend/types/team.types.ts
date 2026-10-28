
export type TeamRole = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
export type MemberStatus = "ACTIVE" | "INACTIVE";

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: TeamRole;
    status: MemberStatus;
    projectsCount: number;
    joinedAt: string;
}

export interface TeamMemberFormValues {
    name: string;
    email: string;
    role: TeamRole;
    status: MemberStatus;
}

export const TEAM_ROLES: { value: TeamRole; label: string }[] = [
    { value: "ADMIN", label: "Admin" },
    { value: "PROJECT_MANAGER", label: "Project Manager" },
    { value: "MEMBER", label: "Member" },
];

export const MEMBER_STATUSES: { value: MemberStatus; label: string; }[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
];


import { initialTeamMembers } from "@/data/team";
import type {
    TeamMember,
    TeamMemberFormValues,
} from "@/types/team.types";

const STORAGE_KEY = "pm_team_members";

function readMembers(): TeamMember[] {
    if (typeof window === "undefined") return initialTeamMembers;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored) as TeamMember[];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTeamMembers));
    } catch {
        return initialTeamMembers;
    }

    return initialTeamMembers;
}

function saveMembers(members: TeamMember[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function createId() {
    return `USR-${Date.now()}`;
}

export const teamService = {
    getAll(): TeamMember[] {
        return readMembers();
    },

    create(values: TeamMemberFormValues): TeamMember {
        const members = readMembers();

        if (
            members.some(
                (member) =>
                    member.email.toLowerCase() === values.email.trim().toLowerCase()
            )
        ) {
            throw new Error("A member with this email already exists.");
        }

        const member: TeamMember = {
            id: createId(),
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            role: values.role,
            status: values.status,
            projectsCount: 0,
            joinedAt: new Date().toISOString().slice(0, 10),
        };

        saveMembers([member, ...members]);
        return member;
    },

    update(id: string, values: TeamMemberFormValues): TeamMember {
        const members = readMembers();

        if (
            members.some(
                (member) =>
                    member.id !== id &&
                    member.email.toLowerCase() === values.email.trim().toLowerCase()
            )
        ) {
            throw new Error("Another member already uses this email.");
        }

        const index = members.findIndex((member) => member.id === id);

        if (index === -1) {
            throw new Error("Member not found.");
        }

        const updated: TeamMember = {
            ...members[index],
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            role: values.role,
            status: values.status,
        };

        members[index] = updated;
        saveMembers(members);

        return updated;
    },

    toggleStatus(id: string): TeamMember {
        const members = readMembers();
        const index = members.findIndex((member) => member.id === id);

        if (index === -1) {
            throw new Error("Member not found.");
        }

        members[index] = {
            ...members[index],
            status: members[index].status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        };

        saveMembers(members);
        return members[index];
    },
};

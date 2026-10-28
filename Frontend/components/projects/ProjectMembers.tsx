
import type { ProjectMember } from "@/types/project.types";

interface ProjectMembersProps {
  members: ProjectMember[];
  limit?: number;
}

export default function ProjectMembers({
  members,
  limit = 3,
}: ProjectMembersProps) {
  const visibleMembers = members.slice(0, limit);
  const remaining = members.length - visibleMembers.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleMembers.map((member) => (
          <div
            key={member.id}
            title={`${member.name} (${member.role.replaceAll("_", " ")})`}
            aria-label={member.name}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold ${
              member.avatarColor ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {member.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <span className="ml-2 text-xs font-medium text-slate-500">
          +{remaining} more
        </span>
      )}

      {members.length === 0 && (
        <span className="text-xs text-slate-400">No members</span>
      )}
    </div>
  );
}

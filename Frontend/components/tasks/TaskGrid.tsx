import type { Task } from "@/types/task.types";
import EmptyState from "@/components/ui/EmptyState";
import TaskCard from "./TaskCard";

interface Props {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export default function TaskGrid({ tasks, onEdit, onDelete }: Props) {
    if (!tasks.length) {
        return (
            <div className="p-5">
                <EmptyState
                    title="No tasks found"
                    description="No tasks match your current filters. Try changing your search or filters."
                />
            </div>
        );
    }

    return (
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

import type { Task } from "@/types/task.types";
import TaskCard from "./TaskCard";

interface Props {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export default function TaskGrid({ tasks, onEdit, onDelete }: Props) {
    if (!tasks.length) {
        return (
            <p className="p-12 text-center text-sm text-slate-500">
                No tasks match your filters.
            </p>
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

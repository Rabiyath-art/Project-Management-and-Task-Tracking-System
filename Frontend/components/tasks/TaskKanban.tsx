"use client";

import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
    type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task.types";
import { TASK_STATUSES } from "@/types/task.types";
import TaskCard from "./TaskCard";

interface Props {
    tasks: Task[];
    onStatusChange: (id: string, status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onAdd: (status: TaskStatus) => void;
}

const dotColors: Record<TaskStatus, string> = {
    TODO: "bg-brand-sage",
    IN_PROGRESS: "bg-brand-primary",
    IN_REVIEW: "bg-amber-600",
    COMPLETED: "bg-sys-success",
};

export default function TaskKanban({
    tasks,
    onStatusChange,
    onEdit,
    onDelete,
    onAdd,
}: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor)
    );

    const [activeId, setActiveId] = useState<string | null>(null);

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);

        const { active, over } = event;
        if (!over) return;

        const taskId = String(active.id);
        const overId = String(over.id);

        const task = tasks.find((item) => item.id === taskId);
        if (!task) return;

        const destinationTask = tasks.find((item) => item.id === overId);

        let destinationStatus: TaskStatus | undefined;

        if (destinationTask) {
            destinationStatus = destinationTask.status;
        } else if (TASK_STATUSES.some((item) => item.value === overId)) {
            destinationStatus = overId as TaskStatus;
        }

        if (destinationStatus && destinationStatus !== task.status) {
            onStatusChange(taskId, destinationStatus);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={(event) => setActiveId(String(event.active.id))}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={handleDragEnd}
        >
            <div className="overflow-x-auto p-4 sm:p-5">
                <div className="grid min-w-[1000px] grid-cols-4 items-start gap-4">
                    {TASK_STATUSES.map((status) => {
                        const columnTasks = tasks.filter(
                            (task) => task.status === status.value
                        );

                        return (
                            <KanbanColumn
                                key={status.value}
                                status={status.value}
                                label={status.label}
                                tasks={columnTasks}
                                activeId={activeId}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAdd={onAdd}
                            />
                        );
                    })}
                </div>
            </div>
        </DndContext>
    );
}

interface KanbanColumnProps {
    status: TaskStatus;
    label: string;
    tasks: Task[];
    activeId: string | null;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onAdd: (status: TaskStatus) => void;
}

function KanbanColumn({
    status,
    label,
    tasks,
    activeId,
    onEdit,
    onDelete,
    onAdd,
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <section
            ref={setNodeRef}
            className={`min-h-96 rounded-xl border p-3 transition-colors ${isOver
                ? "border-brand-primary bg-brand-beige/30 ring-2 ring-inset ring-brand-primary/20"
                : "border-border bg-muted-background"
                }`}
        >
            <div className="mb-4 flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${dotColors[status]}`} />

                    <h3 className="text-sm font-semibold text-foreground">{label}</h3>

                    <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-brand-muted">
                        {tasks.length}
                    </span>
                </div>

                <button
                    type="button"
                    title={`Add task to ${label}`}
                    aria-label={`Add task to ${label}`}
                    onClick={() => onAdd(status)}
                    className="rounded-lg p-1.5 text-brand-muted transition hover:bg-card hover:text-brand-primary"
                >
                    <Plus size={17} />
                </button>
            </div>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <DraggableTask
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isActive={activeId === task.id}
                    />
                ))}

                {tasks.length === 0 && (
                    <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-brand-sage bg-card/70 px-3 text-center text-xs text-brand-muted">
                        {isOver ? "Drop task here" : "No tasks in this column"}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => onAdd(status)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-brand-sage py-2.5 text-sm font-medium text-brand-muted transition hover:border-brand-primary hover:bg-card hover:text-brand-primary"
            >
                <Plus size={15} />
                Add task
            </button>
        </section>
    );
}

interface DraggableTaskProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    isActive: boolean;
}

function DraggableTask({
    task,
    onEdit,
    onDelete,
    isActive,
}: DraggableTaskProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({ id: task.id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Translate.toString(transform) }}
            className={isDragging ? "z-10 opacity-40" : ""}
        >
            <div className="mb-1 flex justify-end">
                <button
                    type="button"
                    {...listeners}
                    {...attributes}
                    aria-label={`Drag ${task.title}`}
                    title="Drag to change status"
                    className="touch-none cursor-grab rounded-md p-1 text-brand-muted transition hover:bg-brand-beige/60 hover:text-brand-primary active:cursor-grabbing"
                >
                    <GripVertical size={17} />
                </button>
            </div>

            <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                showStatus={false}
                isDragging={isDragging || isActive}
            />
        </div>
    );
}
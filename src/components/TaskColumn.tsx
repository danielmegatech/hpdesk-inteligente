import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from './TaskForm';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusStyles: Record<TaskStatus, string> = {
  pendente: "bg-blue-500/10 border-blue-500", // Inbox
  a_fazer: "bg-yellow-500/10 border-yellow-500", // To Do
  emProgresso: "bg-purple-500/10 border-purple-500", // In Progress
  revisao: "bg-orange-500/10 border-orange-500", // Review (not used in Trello example, but kept for existing type)
  concluido: "bg-green-500/10 border-green-500", // Done
  lixeira: "bg-gray-500/10 border-gray-500", // Trash (not a visible column)
};

const TaskColumn = ({ id, title, tasks, onEditTask, onDeleteTask }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const columnClasses = cn(
    "flex flex-col w-[280px] flex-shrink-0 bg-muted/50 rounded-lg shadow-md",
    { 'bg-primary/10 ring-2 ring-primary': isOver }
  );

  return (
    <div ref={setNodeRef} className={columnClasses}>
      <div className={`p-4 border-b-2 ${statusStyles[id]}`}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-muted-foreground">{tasks.length} tarefa(s)</span>
      </div>
      <div className="p-4 flex-grow min-h-[100px] overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
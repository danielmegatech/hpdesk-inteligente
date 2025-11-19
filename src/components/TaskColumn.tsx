import { useDroppable } from '@dnd-kit/core';
import { Task } from './TaskForm';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusStyles = {
  nao_iniciado: "bg-gray-500/10 border-gray-500",
  em_progresso: "bg-blue-500/10 border-blue-500",
  concluido: "bg-green-500/10 border-green-500",
};

const TaskColumn = ({ id, title, tasks, onEditTask, onDeleteTask }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const columnClasses = cn(
    "flex flex-col w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 bg-muted/50 rounded-lg",
    { 'bg-primary/10': isOver }
  );

  return (
    <div ref={setNodeRef} className={columnClasses}>
      <div className={`p-4 border-b-2 ${statusStyles[id as keyof typeof statusStyles]}`}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-muted-foreground">{tasks.length} tarefa(s)</span>
      </div>
      <div className="p-4 flex-grow min-h-[200px] overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
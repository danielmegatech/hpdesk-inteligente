import { Task } from './TaskForm';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { User, Calendar, Trash2, Edit } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityStyles = cva("border-l-4", {
  variants: {
    priority: {
      Alta: "border-red-500",
      Média: "border-yellow-500",
      Baixa: "border-green-500",
    },
  },
});

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1000 : 'auto', // Increased zIndex
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 touch-none">
      <Card className={`rounded-md ${priorityStyles({ priority: task.priority })}`}>
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
          <CardTitle className="text-sm font-semibold">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id!)} className="text-red-500 focus:text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant={task.priority === 'Alta' ? 'destructive' : task.priority === 'Média' ? 'secondary' : 'outline'}>
                {task.priority}
              </Badge>
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{task.assignee}</span>
                </div>
              )}
            </div>
            {task.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(task.deadline, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;
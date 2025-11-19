import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask } from '@/api';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm, { Task } from '@/components/TaskForm';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import TaskColumn from '@/components/TaskColumn';
import { TaskStatus } from '@/components/TaskForm';

const statusMap: Record<TaskStatus, string> = {
  nao_iniciado: 'Não Iniciado',
  em_progresso: 'Em Progresso',
  concluido: 'Concluído',
};

const statusOrder: TaskStatus[] = ['nao_iniciado', 'em_progresso', 'concluido'];

const TasksPage = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', user?.id],
    queryFn: () => apiGetTasks(user!.id),
    enabled: !!user,
  });

  const { mutate: addTask } = useMutation({
    mutationFn: (newTask: Omit<Task, 'id'>) => apiAddTask(newTask, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa criada com sucesso!');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Falha ao criar tarefa.'),
  });

  const { mutate: updateTask } = useMutation({
    mutationFn: (updatedTask: Task) => apiUpdateTask(updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa atualizada com sucesso!');
      setIsModalOpen(false);
      setSelectedTask(undefined);
    },
    onError: () => toast.error('Falha ao atualizar tarefa.'),
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: (taskId: string) => apiDeleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: () => toast.error('Falha ao excluir tarefa.'),
  });

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleOpenModal = (task?: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      nao_iniciado: [],
      em_progresso: [],
      concluido: [],
    };
    tasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const task = tasks.find(t => t.id === active.id);
      const newStatus = over.id as TaskStatus;

      if (task && task.status !== newStatus) {
        updateTask({ ...task, status: newStatus });
      }
    }
  };

  if (isLoading) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold">Quadro de Tarefas</h1>
          <p className="text-muted-foreground">Arraste e solte as tarefas para mudar o status.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Nova Tarefa
        </Button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 w-full overflow-x-auto pb-4">
          {statusOrder.map(status => (
            <TaskColumn
              key={status}
              id={status}
              title={statusMap[status]}
              tasks={tasksByStatus[status]}
              onEditTask={handleOpenModal}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            onSave={handleSaveTask}
            onOpenChange={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
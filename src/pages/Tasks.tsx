import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Edit, MoreVertical, PlusCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  deadline: z.date().optional(),
  status: z.enum(['todo', 'inProgress', 'done']),
});

type Task = z.infer<typeof taskSchema>;

const initialData = {
  todo: [
    { id: 'task-1', title: 'Verificar backup do servidor', description: 'Garantir que o backup noturno foi concluído.', status: 'todo' as const },
  ],
  inProgress: [
    { id: 'task-3', title: 'Reset de senha para usuário', description: 'Usuário: joao.silva', status: 'inProgress' as const, deadline: new Date() },
  ],
  done: [
    { id: 'task-4', title: 'Trocar toner da impressora do 3º andar', description: 'Modelo HP LaserJet Pro M404dn', status: 'done' as const },
  ],
};

const statusMap = {
  todo: 'A Fazer',
  inProgress: 'Em Andamento',
  done: 'Concluído',
};

const TaskForm = ({ task, onSave, onOpenChange }: { task?: Task; onSave: (task: Task) => void; onOpenChange: (open: boolean) => void }) => {
  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: task || { title: '', description: '', status: 'todo' },
  });

  const onSubmit = (data: Task) => {
    onSave(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="deadline" render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Prazo</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                    {field.value ? format(field.value, 'PPP') : <span>Escolha uma data</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
              </PopoverContent>
            </Popover>
          </FormItem>
        )} />
        <Button type="submit">Salvar Tarefa</Button>
      </form>
    </Form>
  );
};

const TaskCard = ({ task, onEdit, onDelete }: { task: Task; onEdit: () => void; onDelete: () => void; }) => (
  <Card className="bg-card group">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold mb-2">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
      {task.deadline && (
        <p className="text-xs text-muted-foreground flex items-center">
          <CalendarIcon className="mr-1.5 h-3 w-3" />
          Prazo: {format(task.deadline, 'dd/MM/yyyy')}
        </p>
      )}
    </CardContent>
  </Card>
);

const KanbanColumn = ({ title, tasks, onEdit, onDelete }: { title: string; tasks: Task[]; onEdit: (task: Task) => void; onDelete: (task: Task) => void; }) => (
  <div className="flex flex-col w-full md:w-1/3 bg-muted/60 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">{title} ({tasks.length})</h3>
    <div className="space-y-3">
      {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} />)}
    </div>
  </div>
);

const TasksPage = () => {
  const [tasks, setTasks] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleSaveTask = (task: Task) => {
    if (task.id) { // Edit
      const status = task.status;
      setTasks(prev => ({
        ...prev,
        [status]: prev[status].map(t => t.id === task.id ? task : t),
      }));
    } else { // Add
      const newTask = { ...task, id: `task-${Date.now()}` };
      setTasks(prev => ({ ...prev, [newTask.status]: [...prev[newTask.status], newTask] }));
    }
    setEditingTask(undefined);
  };

  const handleDeleteTask = (taskToDelete: Task) => {
    const status = taskToDelete.status;
    setTasks(prev => ({
      ...prev,
      [status]: prev[status].filter(t => t.id !== taskToDelete.id),
    }));
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleOpenAdd = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quadro de Tarefas</h1>
          <p className="text-muted-foreground">Gerencie os tickets e tarefas do time.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
            </DialogHeader>
            <TaskForm task={editingTask} onSave={handleSaveTask} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {Object.entries(tasks).map(([status, taskList]) => (
          <KanbanColumn
            key={status}
            title={statusMap[status as keyof typeof statusMap]}
            tasks={taskList}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
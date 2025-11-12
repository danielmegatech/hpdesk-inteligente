import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Edit, MoreVertical, PlusCircle, Trash2, History } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- TYPES AND SCHEMA ---
const taskStatusSchema = z.enum(['todo', 'inProgress', 'done']);
type TaskStatus = z.infer<typeof taskStatusSchema>;

const taskHistorySchema = z.object({
  status: taskStatusSchema,
  timestamp: z.date(),
});
type TaskHistory = z.infer<typeof taskHistorySchema>;

const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  deadline: z.date().optional(),
  status: taskStatusSchema,
  history: z.array(taskHistorySchema),
});
type Task = z.infer<typeof taskSchema>;

// --- INITIAL DATA ---
const initialTasks: Task[] = [
  { id: 'task-1', title: 'Verificar backup do servidor', description: 'Garantir que o backup noturno foi concluído.', status: 'todo', history: [{ status: 'todo', timestamp: new Date() }] },
  { id: 'task-2', title: 'Reset de senha para usuário', description: 'Usuário: joao.silva', status: 'inProgress', deadline: new Date(), history: [{ status: 'todo', timestamp: new Date(Date.now() - 3600000) }, { status: 'inProgress', timestamp: new Date() }] },
  { id: 'task-3', title: 'Trocar toner da impressora', description: 'Modelo HP LaserJet Pro M404dn', status: 'done', history: [{ status: 'todo', timestamp: new Date(Date.now() - 86400000) }, { status: 'inProgress', timestamp: new Date(Date.now() - 7200000) }, { status: 'done', timestamp: new Date() }] },
];

const statusMap: Record<TaskStatus, string> = { todo: 'A Fazer', inProgress: 'Em Andamento', done: 'Concluído' };

// --- COMPONENTS ---
const TaskForm = ({ task, onSave, onOpenChange }: { task?: Task; onSave: (data: Omit<Task, 'id' | 'history'>) => void; onOpenChange: (open: boolean) => void }) => {
  const form = useForm<Omit<Task, 'id' | 'history'>>({
    resolver: zodResolver(taskSchema.omit({ id: true, history: true })),
    defaultValues: task ? { ...task } : { title: '', description: '', status: 'todo' },
  });
  const onSubmit = (data: Omit<Task, 'id' | 'history'>) => { onSave(data); onOpenChange(false); form.reset(); };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
      <FormField control={form.control} name="deadline" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Prazo</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>)} />
      <Button type="submit">Salvar Tarefa</Button>
    </form></Form>
  );
};

const TaskCard = ({ task, onEdit, onDelete, onShowHistory }: { task: Task; onEdit: () => void; onDelete: () => void; onShowHistory: () => void; }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="bg-card group"><CardContent className="p-4">
        <div className="flex justify-between items-start"><h4 className="font-semibold mb-2">{task.title}</h4>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={onShowHistory}><History className="mr-2 h-4 w-4" /> Histórico</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        {task.deadline && (<p className="text-xs text-muted-foreground flex items-center"><CalendarIcon className="mr-1.5 h-3 w-3" />Prazo: {format(task.deadline, 'dd/MM/yyyy')}</p>)}
      </CardContent></Card>
    </div>
  );
};

const KanbanColumn = ({ status, tasks, onEdit, onDelete, onShowHistory }: { status: TaskStatus; tasks: Task[]; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onShowHistory: (task: Task) => void; }) => {
  const { setNodeRef } = useSortable({ id: status, data: { type: 'container' } });
  return (
    <div ref={setNodeRef} className="flex flex-col w-full md:w-1/3 bg-muted/60 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{statusMap[status]} ({tasks.length})</h3>
      <div className="space-y-3">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} onShowHistory={() => onShowHistory(task)} />)}
        </SortableContext>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleSaveTask = (data: Omit<Task, 'id' | 'history'>) => {
    if (selectedTask) { // Edit
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...selectedTask, ...data } : t));
    } else { // Add
      const newTask: Task = { ...data, id: `task-${Date.now()}`, history: [{ status: data.status, timestamp: new Date() }] };
      setTasks([...tasks, newTask]);
    }
    setSelectedTask(undefined);
  };

  const handleDeleteTask = (taskToDelete: Task) => setTasks(tasks.filter(t => t.id !== taskToDelete.id));
  const handleOpenEdit = (task: Task) => { setSelectedTask(task); setIsFormOpen(true); };
  const handleOpenAdd = () => { setSelectedTask(undefined); setIsFormOpen(true); };
  const handleShowHistory = (task: Task) => { setSelectedTask(task); setIsHistoryOpen(true); };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const overContainer = (over.data.current?.type === 'container' ? overId : tasks.find(t => t.id === overId)?.status) as TaskStatus | undefined;
    if (!overContainer || activeTask.status === overContainer) return;

    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === activeId) {
        return { ...task, status: overContainer, history: [...task.history, { status: overContainer, timestamp: new Date() }] };
      }
      return task;
    }));
  };

  const tasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-3xl font-bold">Quadro de Tarefas</h1><p className="text-muted-foreground">Gerencie os tickets e tarefas do time.</p></div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogTrigger asChild><Button onClick={handleOpenAdd}><PlusCircle className="mr-2 h-4 w-4" /> Nova Tarefa</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>{selectedTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle></DialogHeader><TaskForm task={selectedTask} onSave={handleSaveTask} onOpenChange={setIsFormOpen} /></DialogContent>
        </Dialog>
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}><DialogContent>
          <DialogHeader><DialogTitle>Histórico da Tarefa</DialogTitle><DialogDescription>{selectedTask?.title}</DialogDescription></DialogHeader>
          <ul className="space-y-2">{selectedTask?.history.map((h, i) => <li key={i} className="text-sm"><strong>{statusMap[h.status]}:</strong> {format(h.timestamp, "dd/MM/yyyy 'às' HH:mm")}</li>).reverse()}</ul>
        </DialogContent></Dialog>
      </div>
      <Tabs defaultValue="kanban">
        <TabsList><TabsTrigger value="kanban">Kanban</TabsTrigger><TabsTrigger value="calendar">Calendário</TabsTrigger></TabsList>
        <TabsContent value="kanban">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              {(Object.keys(statusMap) as TaskStatus[]).map(status => (
                <KanbanColumn key={status} status={status} tasks={tasksByStatus(status)} onEdit={handleOpenEdit} onDelete={handleDeleteTask} onShowHistory={handleShowHistory} />
              ))}
            </div>
          </DndContext>
        </TabsContent>
        <TabsContent value="calendar">
          <Card className="mt-4"><CardContent className="p-2"><Calendar locale={ptBR} mode="single" selected={new Date()} className="p-0" 
            components={{ Day: ({ date }) => {
              const tasksOnDay = tasks.filter(t => t.deadline && format(t.deadline, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
              return <div className="relative">{format(date, 'd')}{tasksOnDay.length > 0 && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-blue-500 rounded-full" />}</div>;
            }}}
          /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { CalendarIcon, Edit, MoreVertical, PlusCircle, Trash2, History } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskForm, { Task } from '@/components/TaskForm'; // Import TaskForm and Task type
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask } from '@/api'; // Import mock API

// --- TYPES AND SCHEMA ---
const taskStatusMap = {
  novo: 'Novo',
  emAndamento: 'Em Andamento',
  pendenteAutorizacaoEscalado: 'Pendente/Escalado',
  concluido: 'Concluído',
  lixeira: 'Lixeira',
};
type TaskStatus = keyof typeof taskStatusMap;

const statusColorMap: Record<TaskStatus, string> = {
  novo: 'border-blue-500',
  emAndamento: 'border-yellow-500',
  pendenteAutorizacaoEscalado: 'border-orange-500',
  concluido: 'border-green-500',
  lixeira: 'border-red-500',
};

// --- COMPONENTS ---
const TaskCard = ({ task, onEdit, onDelete, onShowHistory }: { task: Task; onEdit: () => void; onDelete: () => void; onShowHistory: () => void; }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  const lastHistoryEntry = task.history[task.history.length - 1];
  const timestampTitle = `Criado: ${format(task.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n` +
                         `Última atualização: ${format(task.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n` +
                         (task.completedAt ? `Concluído: ${format(task.completedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n` : '') +
                         `Status: ${taskStatusMap[task.status]}`;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} title={timestampTitle}>
      <Card className={cn("bg-card group border-l-4 cursor-pointer", statusColorMap[task.status])} onClick={onEdit}><CardContent className="p-4">
        <div className="flex justify-between items-start"><h4 className="font-semibold mb-2">{task.title}</h4>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={onShowHistory}><History className="mr-2 h-4 w-4" /> Histórico</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        {task.location && (<p className="text-xs text-muted-foreground flex items-center">Local: {task.location}</p>)}
        {task.deadline && (<p className="text-xs text-muted-foreground flex items-center"><CalendarIcon className="mr-1.5 h-3 w-3" />Prazo: {format(task.deadline, 'dd/MM/yyyy')} {task.time && `às ${task.time}`}</p>)}
      </CardContent></Card>
    </div>
  );
};

const KanbanColumn = ({ status, tasks, onEdit, onDelete, onShowHistory }: { status: TaskStatus; tasks: Task[]; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onShowHistory: (task: Task) => void; }) => {
  const { setNodeRef } = useSortable({ id: status, data: { type: 'container' } });
  return (
    <div ref={setNodeRef} className="flex flex-col w-full md:w-1/5 bg-muted/60 p-4 rounded-lg min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4">{taskStatusMap[status]} ({tasks.length})</h3>
      <div className="space-y-3 flex-grow">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} onShowHistory={() => onShowHistory(task)} />)}
        </SortableContext>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    setTasks(apiGetTasks());
  }, []);

  const handleSaveTask = (data: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt'>) => {
    if (selectedTask) { // Edit
      const updatedTask = { ...selectedTask, ...data };
      apiUpdateTask(updatedTask);
    } else { // Add
      apiAddTask(data);
    }
    setTasks(apiGetTasks()); // Refresh tasks from API
    setSelectedTask(undefined);
  };

  const handleDeleteTask = (taskToDelete: Task) => {
    apiDeleteTask(taskToDelete.id);
    setTasks(apiGetTasks()); // Refresh tasks from API
  };

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

    const updatedTask = { ...activeTask, status: overContainer };
    apiUpdateTask(updatedTask); // Update via API
    setTasks(apiGetTasks()); // Refresh tasks from API
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
          <ul className="space-y-2">{selectedTask?.history.map((h, i) => <li key={i} className="text-sm"><strong>{taskStatusMap[h.status]}:</strong> {format(h.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</li>).reverse()}</ul>
        </DialogContent></Dialog>
      </div>
      <Tabs defaultValue="kanban">
        <TabsList><TabsTrigger value="kanban">Kanban</TabsTrigger><TabsTrigger value="calendar">Calendário</TabsTrigger></TabsList>
        <TabsContent value="kanban">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              {(Object.keys(taskStatusMap) as TaskStatus[]).map(status => (
                <KanbanColumn key={status} status={status} tasks={tasksByStatus(status)} onEdit={handleOpenEdit} onDelete={handleDeleteTask} onShowHistory={handleShowHistory} />
              ))}
            </div>
          </DndContext>
        </TabsContent>
        <TabsContent value="calendar">
          <Card className="mt-4"><CardContent className="p-2"><Calendar locale={ptBR} mode="single" selected={new Date()} className="p-0" 
            components={{ Day: ({ date }) => {
              const tasksOnDay = tasks.filter(t => t.deadline && format(t.deadline, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
              return (
                <div className="relative text-center">
                  {format(date, 'd')}
                  {tasksOnDay.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-blue-500 rounded-full" title={tasksOnDay.map(t => `${t.title} (${t.time || 'sem hora'})`).join('\n')} />
                  )}
                </div>
              );
            }}}
          /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
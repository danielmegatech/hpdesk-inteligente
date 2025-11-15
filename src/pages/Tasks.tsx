import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { CalendarIcon, Edit, MoreVertical, PlusCircle, Trash2, History, RotateCcw, Flame, ArrowDown, ArrowUp, ChevronsUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskForm, { Task } from '@/components/TaskForm';
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetTrashedTasks, apiRestoreTask, apiPermanentDeleteTask } from '@/api';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Badge } from '@/components/ui/badge';

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

const priorityMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'Baixa': { label: 'Baixa', color: 'bg-blue-500 hover:bg-blue-600', icon: ArrowDown },
  'Média': { label: 'Média', color: 'bg-yellow-500 hover:bg-yellow-600', icon: ArrowUp },
  'Alta': { label: 'Alta', color: 'bg-orange-500 hover:bg-orange-600', icon: ChevronsUp },
  'Urgente': { label: 'Urgente', color: 'bg-red-500 hover:bg-red-600', icon: Flame },
};

const TaskCard = ({ task, onEdit, onDelete, onShowHistory, onRestore, onPermanentDelete, isTrashed = false, highlight = false }: { 
  task: Task; 
  onEdit: () => void; 
  onDelete: () => void; 
  onShowHistory: () => void; 
  onRestore?: () => void; 
  onPermanentDelete?: () => void;
  isTrashed?: boolean;
  highlight?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const priorityInfo = priorityMap[task.priority || 'Média'] || priorityMap['Média'];
  
  const timestampTitle = `Criado: ${format(task.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n` +
                         `Última atualização: ${format(task.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n` +
                         (task.completedAt ? `Concluído: ${format(task.completedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n` : '') +
                         `Status: ${taskStatusMap[task.status]}`;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} title={timestampTitle} data-id={task.id}>
      <Card className={cn("bg-card group border-l-4 cursor-pointer", statusColorMap[task.status], { 'ring-4 ring-blue-500 ring-offset-2': highlight })} onClick={onEdit}><CardContent className="p-4">
        <div className="flex justify-between items-start"><h4 className="font-semibold mb-2">{task.title}</h4>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              {!isTrashed && (
                <>
                  <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={onShowHistory}><History className="mr-2 h-4 w-4" /> Histórico</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Mover para Lixeira</DropdownMenuItem>
                </>
              )}
              {isTrashed && (
                <>
                  <DropdownMenuItem onClick={onRestore}><RotateCcw className="mr-2 h-4 w-4" /> Restaurar</DropdownMenuItem>
                  <DropdownMenuItem onClick={onPermanentDelete} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Excluir Permanentemente</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex flex-col gap-1">
            {task.location && (<p className="flex items-center">Local: {task.location}</p>)}
            {task.deadline && (<p className="flex items-center"><CalendarIcon className="mr-1.5 h-3 w-3" />Prazo: {format(task.deadline, 'dd/MM/yyyy')} {task.time && `às ${task.time}`}</p>)}
          </div>
          {task.priority && !isTrashed && (
            <Badge className={cn("flex items-center gap-1 text-white", priorityInfo.color)}>
              <priorityInfo.icon className="h-3 w-3" />
              {priorityInfo.label}
            </Badge>
          )}
        </div>
      </CardContent></Card>
    </div>
  );
};

const KanbanColumn = ({ status, tasks, onEdit, onDelete, onShowHistory, highlightedTaskId }: { 
  status: TaskStatus; 
  tasks: Task[]; 
  onEdit: (task: Task) => void; 
  onDelete: (task: Task) => void; 
  onShowHistory: (task: Task) => void; 
  highlightedTaskId?: string;
}) => {
  const { setNodeRef } = useSortable({ id: status, data: { type: 'container' } });
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedTaskId) {
      const highlightedTaskElement = columnRef.current?.querySelector(`[data-id="${highlightedTaskId}"]`);
      if (highlightedTaskElement) {
        highlightedTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedTaskId, tasks]);

  return (
    <div ref={setNodeRef} className="flex flex-col w-full md:w-1/5 bg-muted/60 p-4 rounded-lg min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4">{taskStatusMap[status]} ({tasks.length})</h3>
      <div ref={columnRef} className="space-y-3 flex-grow">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} onShowHistory={() => onShowHistory(task)} highlight={task.id === highlightedTaskId} />)}
        </SortableContext>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const { user } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [trashedTasks, setTrashedTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('kanban');

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const highlightedTaskId = searchParams.get('highlight');

  const fetchTasks = async () => {
    if (!user) return;
    const fetchedTasks = await apiGetTasks(user.id);
    setTasks(fetchedTasks);
  };

  const fetchTrashedTasks = async () => {
    if (!user) return;
    const fetchedTrashedTasks = await apiGetTrashedTasks(user.id);
    setTrashedTasks(fetchedTrashedTasks);
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchTrashedTasks();
    }
  }, [user]);

  useEffect(() => {
    if (highlightedTaskId && activeTab === 'kanban') {
      const taskElement = document.querySelector(`[data-id="${highlightedTaskId}"]`);
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedTaskId, activeTab, tasks]);

  const handleSaveTask = async (data: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt'>) => {
    if (!user) return;
    if (selectedTask) {
      const updatedTask = { ...selectedTask, ...data };
      await apiUpdateTask(updatedTask as Task);
      toast.success(`Tarefa "${updatedTask.title}" atualizada com sucesso!`);
    } else {
      const newTask = await apiAddTask(data, user.id);
      if (newTask) {
        toast.success(`Tarefa "${newTask.title}" criada com sucesso!`);
      }
    }
    fetchTasks();
    setSelectedTask(undefined);
  };

  const handleDeleteTask = async (taskToDelete: Task) => {
    await apiDeleteTask(taskToDelete.id);
    toast.info(`Tarefa "${taskToDelete.title}" movida para a lixeira.`);
    fetchTasks();
    fetchTrashedTasks();
  };

  const handleRestoreTask = async (taskToRestore: Task) => {
    await apiRestoreTask(taskToRestore.id);
    toast.success(`Tarefa "${taskToRestore.title}" restaurada.`);
    fetchTasks();
    fetchTrashedTasks();
  };

  const handlePermanentDeleteTask = async (taskToPermanentDelete: Task) => {
    await apiPermanentDeleteTask(taskToPermanentDelete.id);
    toast.success(`Tarefa "${taskToPermanentDelete.title}" excluída permanentemente.`);
    fetchTrashedTasks();
  };

  const handleOpenEdit = (task: Task) => { setSelectedTask(task); setIsFormOpen(true); };
  const handleOpenAdd = () => { setSelectedTask(undefined); setIsFormOpen(true); };
  const handleShowHistory = (task: Task) => { setSelectedTask(task); setIsHistoryOpen(true); };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const overContainer = (over.data.current?.type === 'container' ? overId : tasks.find(t => t.id === overId)?.status) as TaskStatus | undefined;
    if (!overContainer || activeTask.status === overContainer) return;

    const updatedTask = { ...activeTask, status: overContainer };
    await apiUpdateTask(updatedTask);
    toast.info(`Tarefa "${updatedTask.title}" movida para "${taskStatusMap[updatedTask.status]}".`);
    fetchTasks();
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
      <Tabs defaultValue="kanban" onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="kanban">Kanban</TabsTrigger><TabsTrigger value="calendar">Calendário</TabsTrigger><TabsTrigger value="trash">Lixeira</TabsTrigger></TabsList>
        <TabsContent value="kanban">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 mt-4 overflow-x-auto pb-4">
              {(Object.keys(taskStatusMap) as TaskStatus[]).filter(status => status !== 'lixeira').map(status => (
                <KanbanColumn key={status} status={status} tasks={tasksByStatus(status)} onEdit={handleOpenEdit} onDelete={handleDeleteTask} onShowHistory={handleShowHistory} highlightedTaskId={highlightedTaskId || undefined} />
              ))}
            </div>
          </DndContext>
        </TabsContent>
        <TabsContent value="calendar">
          <Card className="mt-4"><CardContent className="p-2"><Calendar locale={ptBR} mode="single" selected={new Date()} className="p-0" 
            components={{ Day: ({ date }) => {
              const tasksOnDay = tasks.filter(t => t.deadline && format(t.deadline, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
              return (
                <div className="relative text-center h-full w-full flex items-center justify-center">
                  <span>{format(date, 'd')}</span>
                  {tasksOnDay.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-blue-500 rounded-full" title={tasksOnDay.map(t => `${t.title} (${t.time || 'sem hora'})`).join('\n')} />
                  )}
                </div>
              );
            }}}
          /></CardContent></Card>
        </TabsContent>
        <TabsContent value="trash">
          <div className="mt-4 space-y-3">
            {trashedTasks.length === 0 ? (
              <p className="text-muted-foreground text-center p-8">A lixeira está vazia.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trashedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={() => {}} 
                    onDelete={() => {}} 
                    onShowHistory={() => handleShowHistory(task)} 
                    onRestore={() => handleRestoreTask(task)}
                    onPermanentDelete={() => handlePermanentDeleteTask(task)}
                    isTrashed={true}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Re-define schema and types here for self-containment, or import from TasksPage if preferred
export const taskStatusSchema = z.enum(['pendente', 'a_fazer', 'emProgresso', 'revisao', 'concluido', 'lixeira']);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

const taskHistorySchema = z.object({
  status: taskStatusSchema,
  timestamp: z.date(),
});
const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  deadline: z.date().optional(),
  location: z.string().optional(),
  time: z.string().optional(),
  priority: z.enum(['Baixa', 'Média', 'Alta']).default('Média'), // Changed to literal union
  status: taskStatusSchema,
  hoursSpent: z.number().optional(),
  estimatedHours: z.number().optional(),
  history: z.array(taskHistorySchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
  deletedAt: z.date().optional(), // Adicionado deletedAt
  assignee: z.string().optional(), // New field
});
export type Task = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Omit<Task, 'history' | 'createdAt' | 'updatedAt' | 'completedAt' | 'deletedAt'>;
  onSave: (data: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt' | 'deletedAt'>) => void;
  onOpenChange: (open: boolean) => void;
}

const TaskForm = ({ task, onSave, onOpenChange }: TaskFormProps) => {
  const form = useForm<Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt' | 'deletedAt'>>({
    resolver: zodResolver(taskSchema.omit({ id: true, history: true, createdAt: true, updatedAt: true, completedAt: true, deletedAt: true })),
    defaultValues: task ? { ...task } : { title: '', description: '', status: 'pendente', location: '', time: '', priority: 'Média', hoursSpent: 0, estimatedHours: 0, assignee: 'Não Atribuído' },
  });
  const onSubmit = (data: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt' | 'deletedAt'>) => { onSave(data); onOpenChange(false); form.reset(); };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
      <div className="flex gap-4">
        <FormField control={form.control} name="location" render={({ field }) => (<FormItem className="flex-1"><FormLabel>Local</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="priority" render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Prioridade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Selecione a prioridade" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="flex gap-4">
        <FormField control={form.control} name="hoursSpent" render={({ field }) => (<FormItem className="flex-1"><FormLabel>Horas Gastas</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="estimatedHours" render={({ field }) => (<FormItem className="flex-1"><FormLabel>Horas Estimadas</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <div className="flex gap-4">
        <FormField control={form.control} name="deadline" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data do Prazo</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>)} />
        <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Hora do Prazo</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <FormField control={form.control} name="assignee" render={({ field }) => (<FormItem><FormLabel>Responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      <Button type="submit">Salvar Tarefa</Button>
    </form></Form>
  );
};

export default TaskForm;
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

// Re-define schema and types here for self-containment, or import from TasksPage if preferred
const taskStatusSchema = z.enum(['novo', 'emAndamento', 'pendenteAutorizacaoEscalado', 'concluido', 'lixeira']);
const taskHistorySchema = z.object({
  status: taskStatusSchema,
  timestamp: z.date(),
});
const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  deadline: z.date().optional(),
  location: z.string().optional(), // New field
  time: z.string().optional(),     // New field for time of deadline
  status: taskStatusSchema,
  history: z.array(taskHistorySchema),
});
export type Task = z.infer<typeof taskSchema>; // Export Task type if needed elsewhere

interface TaskFormProps {
  task?: Omit<Task, 'id' | 'history'>;
  onSave: (data: Omit<Task, 'id' | 'history'>) => void;
  onOpenChange: (open: boolean) => void;
}

const TaskForm = ({ task, onSave, onOpenChange }: TaskFormProps) => {
  const form = useForm<Omit<Task, 'id' | 'history'>>({
    resolver: zodResolver(taskSchema.omit({ id: true, history: true })),
    defaultValues: task ? { ...task } : { title: '', description: '', status: 'novo', location: '', time: '' },
  });
  const onSubmit = (data: Omit<Task, 'id' | 'history'>) => { onSave(data); onOpenChange(false); form.reset(); };
  return (
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
      <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Local</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
      <div className="flex gap-4">
        <FormField control={form.control} name="deadline" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data do Prazo</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>)} />
        <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Hora do Prazo</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
      </div>
      <Button type="submit">Salvar Tarefa</Button>
    </form></Form>
  );
};

export default TaskForm;
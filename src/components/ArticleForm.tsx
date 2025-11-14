import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Re-define schema and types here for self-containment, or import from KnowledgeBasePage if preferred
const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'O título é obrigatório.'),
  content: z.string().min(1, 'O conteúdo é obrigatório.'),
  category: z.string().min(1, 'A categoria é obrigatória.'),
});
export type Article = z.infer<typeof articleSchema>; // Export Article type if needed elsewhere

const categories = ['Hardware', 'Software', 'Rede', 'Sistemas Internos', 'Segurança', 'Outros', 'Atendimento Aluno', 'Atendimento Professor', 'Atendimento Staff', 'Software Académico'];

interface ArticleFormProps {
  article?: Article;
  onSave: (article: Omit<Article, 'id'>) => void;
  onOpenChange: (open: boolean) => void;
}

const ArticleForm = ({ article, onSave, onOpenChange }: ArticleFormProps) => {
  const form = useForm<Omit<Article, 'id'>>({
    resolver: zodResolver(articleSchema.omit({ id: true })),
    defaultValues: article || { title: '', content: '', category: '' },
  });

  const onSubmit = (data: Omit<Article, 'id'>) => {
    onSave(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem><FormLabel>Conteúdo</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger></FormControl>
              <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Salvar Artigo</Button>
      </form>
    </Form>
  );
};

export default ArticleForm;
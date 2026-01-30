import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BlogPost } from './BlogPostCard'; // Import BlogPost type

const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'O título é obrigatório.'),
  content: z.string().min(1, 'O conteúdo é obrigatório.'),
  author: z.string().min(1, 'O autor é obrigatório.'),
  publishedAt: z.date().optional(),
});

interface BlogPostFormProps {
  post?: Partial<BlogPost>; // Alterado para Partial<BlogPost>
  onSave: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => void;
  onOpenChange: (open: boolean) => void;
}

const BlogPostForm = ({ post, onSave, onOpenChange }: BlogPostFormProps) => {
  const form = useForm<Omit<BlogPost, 'id' | 'publishedAt'>>({
    resolver: zodResolver(blogPostSchema.omit({ id: true, publishedAt: true })),
    defaultValues: {
      title: post?.title || '', // Acessa as propriedades de forma segura
      content: post?.content || '',
      author: post?.author || 'Técnico Exemplo',
    },
  });

  const onSubmit = (data: Omit<BlogPost, 'id' | 'publishedAt'>) => {
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
          <FormItem><FormLabel>Conteúdo</FormLabel><FormControl><Textarea {...field} rows={8} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="author" render={({ field }) => (
          <FormItem><FormLabel>Autor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit">Salvar Post</Button>
      </form>
    </Form>
  );
};

export default BlogPostForm;
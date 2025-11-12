import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, MoreVertical, PlusCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'O título é obrigatório.'),
  content: z.string().min(1, 'O conteúdo é obrigatório.'),
  category: z.string().min(1, 'A categoria é obrigatória.'),
});

type Article = z.infer<typeof articleSchema>;

const initialArticles: Article[] = [
  { id: 'kb-1', title: 'Como configurar a impressora de rede?', content: '1. Abra o Painel de Controle...', category: 'Hardware' },
  { id: 'kb-2', title: 'Como acessar a VPN da empresa?', content: 'Abra o cliente Cisco AnyConnect...', category: 'Rede' },
  { id: 'kb-3', title: 'O que fazer quando um software trava?', content: 'Primeiro, tente fechar o programa...', category: 'Software' },
];

const categories = ['Hardware', 'Software', 'Rede', 'Sistemas Internos'];

const ArticleForm = ({ article, onSave, onOpenChange }: { article?: Article; onSave: (article: Article) => void; onOpenChange: (open: boolean) => void }) => {
  const form = useForm<Article>({
    resolver: zodResolver(articleSchema),
    defaultValues: article || { title: '', content: '', category: '' },
  });

  const onSubmit = (data: Article) => {
    onSave(data);
    onOpenChange(false);
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

const KnowledgeBasePage = () => {
  const [articles, setArticles] = useState(initialArticles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);

  const handleSaveArticle = (article: Article) => {
    if (article.id) { // Edit
      setArticles(articles.map(a => a.id === article.id ? article : a));
    } else { // Add
      setArticles([...articles, { ...article, id: `kb-${Date.now()}` }]);
    }
    setEditingArticle(undefined);
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles(articles.filter(a => a.id !== articleId));
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingArticle(undefined);
    setIsDialogOpen(true);
  };

  const articlesByCategory = articles.reduce((acc, article) => {
    (acc[article.category] = acc[article.category] || []).push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
          <p className="text-muted-foreground">Encontre soluções rápidas para problemas comuns.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button onClick={handleOpenAdd}><PlusCircle className="mr-2 h-4 w-4" /> Novo Artigo</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingArticle ? 'Editar Artigo' : 'Novo Artigo'}</DialogTitle></DialogHeader>
            <ArticleForm article={editingArticle} onSave={handleSaveArticle} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-8">
        {categories.map(category => (
          articlesByCategory[category] && (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {articlesByCategory[category].map(article => (
                  <Card key={article.id} className="flex flex-col group">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleOpenEdit(article)}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteArticle(article.id!)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm whitespace-pre-line">{article.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
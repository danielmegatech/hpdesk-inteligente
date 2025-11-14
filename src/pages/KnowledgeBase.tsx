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
import { Edit, MoreVertical, PlusCircle, Trash2, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import ArticleForm from '@/components/ArticleForm'; // Import ArticleForm from its new location

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'O título é obrigatório.'),
  content: z.string().min(1, 'O conteúdo é obrigatório.'),
  category: z.string().min(1, 'A categoria é obrigatória.'),
});

export type Article = z.infer<typeof articleSchema>; // Export Article type for use in other files

const initialArticles: Article[] = [
  { id: 'kb-1', title: 'Como configurar a impressora de rede?', content: '1. Abra o Painel de Controle...\n2. Vá em "Dispositivos e Impressoras"...\n3. Clique em "Adicionar uma impressora"...', category: 'Hardware' },
  { id: 'kb-2', title: 'Como acessar a VPN da empresa?', content: 'Abra o cliente Cisco AnyConnect...\nDigite o endereço vpn.suaempresa.com.br...', category: 'Rede' },
  { id: 'kb-3', title: 'O que fazer quando um software trava?', content: 'Primeiro, tente fechar o programa pelo Gerenciador de Tarefas (Ctrl+Shift+Esc).', category: 'Software' },
  { id: 'kb-4', title: 'Guia de Segurança de Senhas', content: 'Use senhas fortes e únicas. Não compartilhe suas senhas.', category: 'Segurança' },
];

const categories = ['Hardware', 'Software', 'Rede', 'Sistemas Internos', 'Segurança', 'Outros'];

// ArticleForm component moved to src/components/ArticleForm.tsx

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
          <Card key={category} className="p-4">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-6 w-6 text-primary" /> {category}
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="p-0 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articlesByCategory[category] && articlesByCategory[category].length > 0 ? (
                articlesByCategory[category].map(article => (
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
                ))
              ) : (
                <p className="text-muted-foreground col-span-full">Nenhum artigo nesta categoria.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
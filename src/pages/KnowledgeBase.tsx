import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreVertical, PlusCircle, Trash2, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ArticleForm, { Article } from '@/components/ArticleForm'; // Import ArticleForm and Article type
import { apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle } from '@/api'; // Import mock API

const categories = ['Hardware', 'Software', 'Rede', 'Sistemas Internos', 'Segurança', 'Outros', 'Atendimento Aluno', 'Atendimento Professor', 'Atendimento Staff', 'Software Académico'];

const KnowledgeBasePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);

  useEffect(() => {
    setArticles(apiGetArticles());
  }, []);

  const handleSaveArticle = (data: Omit<Article, 'id'>) => {
    if (editingArticle) { // Edit
      const updatedArticle = { ...editingArticle, ...data };
      apiUpdateArticle(updatedArticle);
    } else { // Add
      apiAddArticle(data);
    }
    setArticles(apiGetArticles()); // Refresh articles from API
    setEditingArticle(undefined);
  };

  const handleDeleteArticle = (articleId: string) => {
    apiDeleteArticle(articleId);
    setArticles(apiGetArticles()); // Refresh articles from API
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
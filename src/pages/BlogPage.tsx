import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Rss } from 'lucide-react';
import BlogPostCard, { BlogPost } from '@/components/BlogPostCard';
import BlogPostForm from '@/components/BlogPostForm';
import { apiGetBlogPosts, apiAddBlogPost, apiUpdateBlogPost, apiDeleteBlogPost } from '@/api';
import { toast } from 'sonner';

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);

  useEffect(() => {
    setPosts(apiGetBlogPosts());
  }, []);

  const handleSavePost = (data: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    if (editingPost) { // Edit
      const updatedPost = { ...editingPost, ...data };
      apiUpdateBlogPost(updatedPost);
      toast.success(`Post "${data.title}" atualizado!`);
    } else { // Add
      apiAddBlogPost(data);
      toast.success(`Novo post "${data.title}" publicado!`);
    }
    setPosts(apiGetBlogPosts()); // Refresh posts from API
    setEditingPost(undefined);
  };

  const handleDeletePost = (postId: string) => {
    apiDeleteBlogPost(postId);
    setPosts(apiGetBlogPosts()); // Refresh posts from API
    toast.info('Post excluído.');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingPost(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold">Blog de Atualizações</h1>
          <p className="text-muted-foreground">Fique por dentro das últimas notícias e atualizações do sistema.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button onClick={handleOpenAdd}><PlusCircle className="mr-2 h-4 w-4" /> Novo Post</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingPost ? 'Editar Post' : 'Novo Post'}</DialogTitle></DialogHeader>
            <BlogPostForm post={editingPost} onSave={handleSavePost} onOpenChange={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-muted-foreground col-span-full">Nenhum post de blog ainda.</p>
        ) : (
          posts.map(post => (
            <BlogPostCard key={post.id} post={post} onEdit={handleOpenEdit} onDelete={handleDeletePost} />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
}

interface BlogPostCardProps {
  post: BlogPost;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (postId: string) => void;
}

const BlogPostCard = ({ post, onEdit, onDelete }: BlogPostCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{post.title}</CardTitle>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(post)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">{post.content}</p>
        <CardDescription className="text-xs">
          Por {post.author} em {format(post.publishedAt, 'dd/MM/yyyy', { locale: ptBR })}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
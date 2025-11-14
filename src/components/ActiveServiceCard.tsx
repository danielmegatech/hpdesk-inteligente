import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MindmapNode } from '@/data/mindmap';
import { ArrowRight, CheckCircle, AlertTriangle, User } from 'lucide-react';

interface ActiveServiceCardProps {
  history: MindmapNode[];
  status: 'active' | 'resolved' | 'escalated';
  escalatedTo?: string; // Who resolved it if escalated
}

const ActiveServiceCard = ({ history, status, escalatedTo }: ActiveServiceCardProps) => {
  if (history.length === 0) {
    return null;
  }

  const currentQuestion = history[history.length - 1]?.question;

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-lg animate-in fade-in slide-in-from-top-10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Atendimento Atual</CardTitle>
        {status === 'active' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
        {status === 'resolved' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {status === 'escalated' && <User className="h-5 w-5 text-red-500" />}
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-2">
          {status === 'active' && `Em andamento: ${currentQuestion}`}
          {status === 'resolved' && `Resolvido: ${currentQuestion}`}
          {status === 'escalated' && `Escalado: ${currentQuestion}`}
        </CardDescription>
        <div className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
          {history.map((node, index) => (
            <span key={node.id} className="flex items-center">
              {node.question.length > 20 ? node.question.substring(0, 17) + '...' : node.question}
              {index < history.length - 1 && <ArrowRight className="h-3 w-3 mx-1" />}
            </span>
          ))}
        </div>
        {status === 'escalated' && escalatedTo && (
          <p className="text-sm text-red-500 mt-2">Resolvido por: {escalatedTo}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveServiceCard;
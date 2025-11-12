import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const kanbanData = {
  todo: [
    { id: 'task-1', title: 'Verificar backup do servidor', description: 'Garantir que o backup noturno foi concluído.' },
    { id: 'task-2', title: 'Instalar software no notebook do financeiro', description: 'Notebook #FIN-04' },
  ],
  inProgress: [
    { id: 'task-3', title: 'Reset de senha para usuário', description: 'Usuário: joao.silva' },
  ],
  done: [
    { id: 'task-4', title: 'Trocar toner da impressora do 3º andar', description: 'Modelo HP LaserJet Pro M404dn' },
    { id: 'task-5', title: 'Resolver problema de lentidão no PC da recepção', description: 'Limpeza de arquivos temporários.' },
  ],
};

const KanbanColumn = ({ title, tasks }: { title: string; tasks: { id: string; title: string; description: string }[] }) => (
  <div className="flex flex-col w-full md:w-1/3 bg-muted/60 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">{title} ({tasks.length})</h3>
    <div className="space-y-3">
      {tasks.map(task => (
        <Card key={task.id} className="bg-card">
          <CardContent className="p-4">
            <h4 className="font-semibold">{task.title}</h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const TasksPage = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quadro de Tarefas</h1>
          <p className="text-muted-foreground">Gerencie os tickets e tarefas do time.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <KanbanColumn title="A Fazer" tasks={kanbanData.todo} />
        <KanbanColumn title="Em Andamento" tasks={kanbanData.inProgress} />
        <KanbanColumn title="Concluído" tasks={kanbanData.done} />
      </div>
    </div>
  );
};

export default TasksPage;
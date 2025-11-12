import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const TasksPage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Tarefas (Kanban)</CardTitle>
          <CardDescription>
            Aqui ficará o quadro Kanban para gerenciamento de tarefas pendentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PossibilityTree from '@/components/PossibilityTree';
import { possibilityTreeData, reportMetrics } from '@/data/reportsData';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'; // Adicionando importações dos ícones

const StatCard = ({ title, value, change, icon: Icon }: typeof reportMetrics[0]) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change} em relação a ontem</p>
    </CardContent>
  </Card>
);

const ReportsPage = () => {
  // Simulated data for additional metrics
  const simulatedTasks = [
    { id: 't1', status: 'concluido', resolutionTime: 30, category: 'Rede', completedAt: new Date(Date.now() - 3600000) },
    { id: 't2', status: 'concluido', resolutionTime: 60, category: 'Hardware', completedAt: new Date(Date.now() - 7200000) },
    { id: 't3', status: 'emAndamento', category: 'Software' },
    { id: 't4', status: 'concluido', resolutionTime: 45, category: 'Rede', completedAt: new Date(Date.now() - 1800000) },
  ];

  const tasksConcludedToday = simulatedTasks.filter(t => t.status === 'concluido' && t.completedAt && formatDistanceToNow(t.completedAt, { addSuffix: false, locale: ptBR }).includes('horas')).length;
  const avgResolutionTime = simulatedTasks.filter(t => t.status === 'concluido' && t.resolutionTime).reduce((sum, t) => sum + t.resolutionTime!, 0) / tasksConcludedToday || 0;

  const additionalMetrics = [
    { title: 'Tarefas Concluídas Hoje', value: tasksConcludedToday.toString(), change: '+3', icon: CheckCircle },
    { title: 'Tempo Médio de Resolução (Geral)', value: `${Math.round(avgResolutionTime)} min`, change: '-10 min', icon: CheckCircle },
    { title: 'Tickets Escalados (Semana)', value: '5', change: '+1', icon: AlertTriangle },
    { title: 'Artigos KB Adicionados (Mês)', value: '12', change: '+2', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-8">
      <div className="text-left w-full">
        <h1 className="text-3xl font-bold">Métricas e Relatórios</h1>
        <p className="text-muted-foreground">
          Dashboard com métricas de atendimento e relatórios.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {reportMetrics.map(metric => <StatCard key={metric.title} {...metric} />)}
        {additionalMetrics.map(metric => <StatCard key={metric.title} {...metric} />)}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Árvore de Possibilidades do Atendimento</CardTitle>
          <p className="text-muted-foreground pt-1">Análise de um fluxo de atendimento para identificar rotas alternativas.</p>
        </CardHeader>
        <CardContent>
          <PossibilityTree data={possibilityTreeData} />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground w-full text-left">
        <strong className="text-primary">Nota:</strong> As métricas acima são simuladas. Para dados em tempo real, seria necessária uma integração com um sistema de gerenciamento de tarefas e um backend.
      </p>
    </div>
  );
};

export default ReportsPage;
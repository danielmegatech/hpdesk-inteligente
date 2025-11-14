import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PossibilityTree from '@/components/PossibilityTree';
import { possibilityTreeData } from '@/data/reportsData'; // Keep possibilityTreeData
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiGetReportMetrics } from '@/api'; // Import mock API for reports

const StatCard = ({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

const ReportsPage = () => {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    setMetrics(apiGetReportMetrics());
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-8">
      <div className="text-left w-full">
        <h1 className="text-3xl font-bold">Métricas e Relatórios</h1>
        <p className="text-muted-foreground">
          Dashboard com métricas de atendimento e relatórios.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {metrics.map(metric => <StatCard key={metric.title} {...metric} />)}
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
        <strong className="text-primary">Nota:</strong> As métricas acima são geradas por um sistema simulado (mock API) para demonstração. Em um ambiente real, seriam conectadas a um backend de gestão de tarefas.
      </p>
    </div>
  );
};

export default ReportsPage;
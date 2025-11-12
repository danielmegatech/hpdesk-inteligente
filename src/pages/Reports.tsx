import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PossibilityTree from '@/components/PossibilityTree';
import { possibilityTreeData, reportMetrics } from '@/data/reportsData';

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
    </div>
  );
};

export default ReportsPage;
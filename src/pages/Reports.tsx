import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PossibilityTree from '@/components/PossibilityTree';
import { possibilityTreeData, completedServiceFlowData } from '@/data/reportsData'; // Keep possibilityTreeData, import completedServiceFlowData
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle, Clock, User, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiGetReportMetrics, apiGetAuditLog, apiGetResolutionChartData } from '@/api'; // Import chart data API
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ResolutionChart from '@/components/ResolutionChart'; // Import the new chart component
import DraggableMindmap from '@/components/DraggableMindmap'; // Import new component
import { mockDraggableNodes } from '@/data/draggableMindmapData'; // Import mock data

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
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setMetrics(await apiGetReportMetrics());
      setAuditLog(apiGetAuditLog());
      setChartData(apiGetResolutionChartData());
    };
    loadData();
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

      <ResolutionChart data={chartData} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mindmap Interativo (Arrastável)</CardTitle>
          <p className="text-muted-foreground pt-1">Visualização de nós de fluxo de trabalho com capacidade de arrastar e mover (pan).</p>
        </CardHeader>
        <CardContent>
          <DraggableMindmap nodes={mockDraggableNodes} />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Árvore de Possibilidades do Atendimento (Exemplo)</CardTitle>
          <p className="text-muted-foreground pt-1">Análise de um fluxo de atendimento para identificar rotas alternativas.</p>
        </CardHeader>
        <CardContent>
          <PossibilityTree data={possibilityTreeData} />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Fluxo de Atendimento Concluído (Exemplo)</CardTitle>
          <p className="text-muted-foreground pt-1">Visualização de um caminho específico percorrido num atendimento já finalizado.</p>
        </CardHeader>
        <CardContent>
          <PossibilityTree data={completedServiceFlowData} />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Registo de Auditoria (Mock)</CardTitle>
          <p className="text-muted-foreground pt-1">Histórico de ações e eventos importantes no sistema.</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {auditLog.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">{entry.action} por {entry.user}</p>
                    <p className="text-xs text-muted-foreground">{entry.details}</p>
                    <p className="text-xs text-gray-500">{format(entry.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground w-full text-left">
        <strong className="text-primary">Nota:</strong> As métricas e registos de auditoria são gerados por um sistema simulado (mock API) para demonstração. Em um ambiente real, seriam conectadas a um backend de gestão de tarefas e um sistema de logs.
      </p>
    </div>
  );
};

export default ReportsPage;
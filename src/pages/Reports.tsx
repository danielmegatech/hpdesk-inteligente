import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PossibilityTree from '@/components/PossibilityTree';
import { possibilityTreeData, completedServiceFlowData } from '@/data/reportsData';
import { formatDistanceToNow, format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle, Clock, User, FileText, Trash2, CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiGetReportMetrics, apiGetAuditLog, apiGetResolutionChartData } from '@/api';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ResolutionChart from '@/components/ResolutionChart';
import DraggableMindmap from '@/components/DraggableMindmap';
import { mockDraggableNodes } from '@/data/draggableMindmapData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [reportType, setReportType] = useState('daily'); // 'daily', 'weekly', 'monthly'

  useEffect(() => {
    const loadData = async () => {
      setMetrics(await apiGetReportMetrics());
      setAuditLog(apiGetAuditLog());
      setChartData(apiGetResolutionChartData()); // Esta função já gera dados para 7 dias
    };
    loadData();
  }, []);

  // Lógica para filtrar dados com base no dateRange e reportType (mockada por enquanto)
  const filteredChartData = chartData.filter(item => {
    // Implementar lógica de filtragem real aqui se os dados mock fossem mais complexos
    return true;
  });

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-8">
      <div className="text-left w-full">
        <h1 className="text-3xl font-bold">Dashboard de Métricas</h1>
        <p className="text-muted-foreground">
          Dashboard com métricas de atendimento e relatórios.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 w-full justify-end">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y", { locale: ptBR })
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange as any}
              onSelect={setDateRange as any}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {metrics.map(metric => <StatCard key={metric.title} {...metric} />)}
      </div>

      <ResolutionChart data={filteredChartData} />

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
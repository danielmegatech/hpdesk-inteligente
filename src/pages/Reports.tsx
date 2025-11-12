import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const ReportsPage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Métricas e Relatórios</CardTitle>
          <CardDescription>
            Dashboard com métricas de atendimento e relatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
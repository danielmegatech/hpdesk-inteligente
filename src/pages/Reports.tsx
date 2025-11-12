import HorizontalMindmap from '@/components/HorizontalMindmap';

const ReportsPage = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Métricas e Relatórios</h1>
        <p className="text-muted-foreground">
          Dashboard com métricas de atendimento e relatórios.
        </p>
      </div>
      <HorizontalMindmap />
    </div>
  );
};

export default ReportsPage;
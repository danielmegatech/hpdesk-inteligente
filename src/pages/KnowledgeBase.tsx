import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const KnowledgeBasePage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Base de Conhecimento</CardTitle>
          <CardDescription>
            Interface para gerenciar e consultar a base de conhecimento interna do IT Helpdesk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Funcionalidade em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBasePage;
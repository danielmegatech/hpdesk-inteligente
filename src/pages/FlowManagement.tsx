import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mindmapData, categories } from '@/data/mindmap';
import FlowVisualizer from '@/components/FlowVisualizer';
import { LayoutDashboard, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FlowManagementPage = () => {
  return (
    <div className="w-full space-y-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Gerenciamento de Fluxos</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie os fluxos de atendimento existentes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" /> Fluxos por Categoria
          </CardTitle>
          <CardDescription>
            Expanda cada categoria para ver os fluxos de atendimento associados.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {categories.map(category => {
              const startNode = mindmapData[category.startNodeId];
              if (!startNode) return null; // Skip if start node is not defined

              return (
                <AccordionItem value={category.id} key={category.id}>
                  <AccordionTrigger className="text-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-5 w-5 text-primary" />
                      {category.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 border rounded-md bg-muted/20 mt-2">
                      <h4 className="font-semibold mb-2">Fluxo: {startNode.question}</h4>
                      <FlowVisualizer startNodeId={startNode.id} />
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" disabled>
                          <Edit className="mr-2 h-4 w-4" /> Editar Fluxo (Em Breve)
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowManagementPage;
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mindmapData } from '@/data/mindmap';
import FlowVisualizer from '@/components/FlowVisualizer';

const FlowsPage = () => {
  // Get the starting node for the "Fluxos de Atendimento" category
  const flowsStartNode = mindmapData['fluxos_atendimento_start'];

  return (
    <div className="w-full space-y-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Fluxos de Atendimento</h1>
        <p className="text-muted-foreground">
          Visualização dos fluxos de trabalho padronizados para diferentes cenários de atendimento.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {flowsStartNode.options.map(flowOption => (
              <AccordionItem value={flowOption.nextNodeId!} key={flowOption.nextNodeId}>
                <AccordionTrigger className="text-lg">{flowOption.text}</AccordionTrigger>
                <AccordionContent>
                  {flowOption.nextNodeId ? (
                    <FlowVisualizer startNodeId={flowOption.nextNodeId} />
                  ) : (
                    <p>Este fluxo não está definido.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowsPage;
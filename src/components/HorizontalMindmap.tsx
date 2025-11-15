import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMindmap } from "@/context/MindmapContext";
import { ArrowRight } from "lucide-react";

const HorizontalMindmap = () => {
  const { mindmapData } = useMindmap();

  const sampleHistory = [
    mindmapData['computer_start'],
    mindmapData['computer_power_issue'],
    mindmapData['end_ticket_power_supply'],
  ].filter(Boolean); // Filter out undefined nodes if the imported map is different

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualização de Atendimento</CardTitle>
        <CardDescription>
          Exemplo de um fluxo de atendimento em formato de linha do tempo horizontal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center p-4 overflow-x-auto">
          {sampleHistory.map((node, index) => (
            <div key={node.id} className="flex items-center flex-shrink-0">
              <div className="border-2 border-primary rounded-lg p-4 w-48 text-center bg-card">
                <p className="font-semibold text-sm">{node.question}</p>
              </div>
              {index < sampleHistory.length - 1 && (
                <div className="w-16 text-center">
                  <ArrowRight className="h-8 w-8 text-muted-foreground inline-block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default HorizontalMindmap;
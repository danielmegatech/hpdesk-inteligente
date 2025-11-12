import { MindmapNode as MindmapNodeType } from '@/data/mindmap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, PlusCircle, SkipForward } from 'lucide-react';

interface MindmapNodeProps {
  node: MindmapNodeType;
  onSelectOption: (nextNodeId: string | null) => void;
  onReset: () => void;
}

const MindmapNode = ({ node, onSelectOption, onReset }: MindmapNodeProps) => {
  const isEndNode = node.options.length === 0;

  return (
    <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95">
      <CardHeader>
        <CardTitle className="text-2xl">{isEndNode ? 'Atendimento Finalizado' : 'Próximo Passo'}</CardTitle>
        <CardDescription>Siga as instruções abaixo para continuar o atendimento.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6 min-h-[60px] flex items-center justify-center text-center">{node.question}</p>
        <div className="flex flex-col space-y-3">
          {node.options.map((option) => (
            <Button
              key={option.text}
              onClick={() => onSelectOption(option.nextNodeId)}
              size="lg"
            >
              {option.text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>
        {isEndNode && (
            <div className="mt-6 text-center">
                <Button onClick={onReset}>Iniciar Novo Atendimento</Button>
            </div>
        )}
        {!isEndNode && (
            <div className="flex justify-center space-x-4 mt-8 border-t pt-4">
                <Button variant="outline" size="sm">
                    <SkipForward className="mr-2 h-4 w-4" /> Pular
                </Button>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Entrada
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MindmapNode;
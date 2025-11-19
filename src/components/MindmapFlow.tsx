import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CornerDownLeft, ArrowUpRight, XCircle } from 'lucide-react';
import { MindmapNode } from '@/data/mindmap';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Keep Tooltip for other uses if any

interface MindmapFlowProps {
  node: MindmapNode;
  onSelectOption: (nextNodeId: string | null) => void;
  onReset: () => void;
  onBack: () => void;
  onEscalate: () => void;
}

const MindmapFlow = ({ node, onSelectOption, onReset, onBack, onEscalate }: MindmapFlowProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (node.options.length > 0) {
      if (event.key === 'ArrowRight') {
        onSelectOption(node.options[0].nextNodeId);
      } else if (event.key === 'ArrowLeft') {
        if (node.options.length > 1) {
          onSelectOption(node.options[1].nextNodeId);
        } else {
          onBack(); // If only one option, left arrow acts as back
        }
      }
    }
    if (event.key === 'Backspace') {
      onBack();
    }
    if (event.key === 'Escape') {
      onReset();
    }
    if (event.key === 'e' || event.key === 'E') { // 'E' for Escalate
      onEscalate();
    }
  }, [node.options, onSelectOption, onBack, onReset, onEscalate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const isEndNode = node.options.length === 0;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg animate-in fade-in slide-in-from-bottom-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{node.question}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isEndNode ? (
          <div className="text-center text-lg text-green-600 dark:text-green-400 font-semibold">
            {node.question}
          </div>
        ) : (
          node.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onSelectOption(option.nextNodeId)}
              className="w-full py-3 text-lg"
              variant={index === 0 ? 'default' : 'outline'}
            >
              {option.text}
            </Button>
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button onClick={onBack} variant="outline" disabled={node.id.endsWith('_start') && node.id !== 'others_start'}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        {!isEndNode && (
          <Button onClick={onEscalate} variant="destructive">
            <ArrowUpRight className="mr-2 h-4 w-4" /> Escalar
          </Button>
        )}
        {isEndNode && (
          <Button onClick={onReset} variant="secondary">
            <XCircle className="mr-2 h-4 w-4" /> Finalizar Atendimento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MindmapFlow;
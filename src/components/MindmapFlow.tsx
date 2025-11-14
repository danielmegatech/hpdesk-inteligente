import { MindmapNode } from '@/data/mindmap';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, SkipForward, ArrowLeft, ArrowDown } from 'lucide-react';
import { useEffect } from 'react';

interface MindmapFlowProps {
  node: MindmapNode;
  onSelectOption: (nextNodeId: string | null) => void;
  onReset: () => void;
  onBack: () => void;
  onEscalate: () => void; // New prop for escalation
}

const MindmapFlow = ({ node, onSelectOption, onReset, onBack, onEscalate }: MindmapFlowProps) => {
  const isEndNode = node.options.length === 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEndNode) return; // No keyboard navigation on end nodes

      switch (event.key) {
        case 'ArrowRight': // Sim (first option)
          if (node.options.length > 0) {
            onSelectOption(node.options[0].nextNodeId);
          }
          break;
        case 'ArrowLeft': // Não (second option) or Back
          if (node.options.length > 1) {
            onSelectOption(node.options[1].nextNodeId);
          } else {
            onBack(); // If only one option, or no specific 'Não', go back
          }
          break;
        case ' ': // Space for Pular
          // Assuming 'Pular' would move to a generic next step or end the flow
          // For now, we can map it to a specific action if needed, or just prevent default
          event.preventDefault(); // Prevent scrolling
          // Implement 'Pular' logic here if it's a distinct action
          // For this example, I'll just prevent default and not map to a specific node
          break;
        case 'ArrowDown': // Não sei / Escalar
          onEscalate();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [node, isEndNode, onSelectOption, onBack, onEscalate]);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8 p-4 animate-in fade-in zoom-in-95">
      {/* Current Question Node */}
      <div className="relative w-full max-w-md p-6 bg-slate-800 border border-blue-500/50 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] text-center">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-500"></div>
        <h2 className="text-xl font-bold text-white">{node.question}</h2>
      </div>

      {/* Connecting Line */}
      {!isEndNode && (
        <div className="w-1 h-16 bg-slate-700/50"></div>
      )}

      {/* Options */}
      {isEndNode ? (
        <div className="text-center animate-in fade-in slide-in-from-bottom-10 flex gap-4">
          <Button onClick={onBack} size="lg" variant="outline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </Button>
          <Button onClick={onReset} size="lg" variant="secondary">
            Iniciar Novo Atendimento
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {node.options.map((option, index) => (
            <button
              key={option.text}
              onClick={() => onSelectOption(option.nextNodeId)}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-slate-800 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 animate-in fade-in slide-in-from-bottom-5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="absolute left-0 top-0 h-full w-0 bg-blue-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center">
                {option.text}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      )}
      
      {!isEndNode && (
        <div className="flex justify-center space-x-4 mt-8 border-t border-slate-700 w-full max-w-md pt-6">
            <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button variant="outline" size="sm">
                <SkipForward className="mr-2 h-4 w-4" /> Pular
            </Button>
            <Button variant="destructive" size="sm" onClick={onEscalate}> {/* New Escalate button */}
                <ArrowDown className="mr-2 h-4 w-4" /> Escalar
            </Button>
        </div>
      )}

      {/* Keyboard Navigation Tips */}
      {!isEndNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center space-x-2">
          <span>Dicas:</span>
          <span className="flex items-center"><ArrowRight className="h-3 w-3 mr-1" /> Sim</span>
          <span className="flex items-center"><ArrowLeft className="h-3 w-3 mr-1" /> Não / Voltar</span>
          <span className="flex items-center">Espaço Pular</span>
          <span className="flex items-center"><ArrowDown className="h-3 w-3 mr-1" /> Escalar</span>
        </div>
      )}
    </div>
  );
};

export default MindmapFlow;
import { MindmapNode } from '@/data/mindmap';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, SkipForward } from 'lucide-react';

interface MindmapFlowProps {
  node: MindmapNode;
  onSelectOption: (nextNodeId: string | null) => void;
  onReset: () => void;
}

const MindmapFlow = ({ node, onSelectOption, onReset }: MindmapFlowProps) => {
  const isEndNode = node.options.length === 0;

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
        <div className="text-center animate-in fade-in slide-in-from-bottom-10">
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
            <Button variant="outline" size="sm">
                <SkipForward className="mr-2 h-4 w-4" /> Pular
            </Button>
            <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Entrada
            </Button>
        </div>
      )}
    </div>
  );
};

export default MindmapFlow;
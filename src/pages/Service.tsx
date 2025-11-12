import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MindmapFlow from '@/components/MindmapFlow';
import MindmapHistory from '@/components/MindmapHistory';
import { mindmapData, START_NODE_ID, MindmapNode } from '@/data/mindmap';
import { PlayCircle } from 'lucide-react';

const ServicePage = () => {
  const [serviceStarted, setServiceStarted] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(START_NODE_ID);
  const [history, setHistory] = useState<MindmapNode[]>([]);

  const handleStartService = () => {
    setServiceStarted(true);
    setCurrentNodeId(START_NODE_ID);
    setHistory([]);
  };
  
  const handleReset = () => {
    setServiceStarted(false);
    setCurrentNodeId(START_NODE_ID);
    setHistory([]);
  }

  const handleSelectOption = (nextNodeId: string | null) => {
    if (currentNodeId) {
      const lastNode = mindmapData[currentNodeId];
      setHistory([...history, lastNode]);
    }
    setCurrentNodeId(nextNodeId);
  };

  const currentNode = currentNodeId ? mindmapData[currentNodeId] : null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {!serviceStarted ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Helpdesk Inteligente</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Pronto para iniciar um novo atendimento?
          </p>
          <Button onClick={handleStartService} size="lg">
            <PlayCircle className="mr-2 h-6 w-6" />
            Iniciar Atendimento
          </Button>
        </div>
      ) : (
        <>
          <MindmapHistory history={history} />
          {currentNode && <MindmapFlow node={currentNode} onSelectOption={handleSelectOption} onReset={handleReset} />}
        </>
      )}
    </div>
  );
};

export default ServicePage;
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MindmapFlow from '@/components/MindmapFlow';
import MindmapHistory from '@/components/MindmapHistory';
import { mindmapData, categories, MindmapNode } from '@/data/mindmap';
import { PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

type ServiceState = 'idle' | 'selecting_category' | 'in_flow';

const ServicePage = () => {
  const [state, setState] = useState<ServiceState>('idle');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<MindmapNode[]>([]);

  const handleStartService = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
  };

  const handleCategorySelect = (startNodeId: string) => {
    setCurrentNodeId(startNodeId);
    setState('in_flow');
  };
  
  const handleReset = () => {
    setState('idle');
    setCurrentNodeId(null);
    setHistory([]);
  }

  const handleBackToCategories = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
  }

  const handleSelectOption = (nextNodeId: string | null) => {
    if (currentNodeId) {
      const lastNode = mindmapData[currentNodeId];
      setHistory([...history, lastNode]);
    }
    setCurrentNodeId(nextNodeId);
  };

  const renderContent = () => {
    switch (state) {
      case 'idle':
        return (
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
        );
      case 'selecting_category':
        return (
          <div className="w-full max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Selecione o Tema do Atendimento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Card 
                  key={cat.id} 
                  className="flex flex-col items-center justify-center p-6 hover:bg-accent hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleCategorySelect(cat.startNodeId)}
                >
                  <cat.icon className="h-10 w-10 mb-3 text-primary" />
                  <CardHeader className="p-0">
                    <CardTitle className="text-base">{cat.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'in_flow':
        const currentNode = currentNodeId ? mindmapData[currentNodeId] : null;
        return (
          <>
            <MindmapHistory history={history} />
            {currentNode && <MindmapFlow node={currentNode} onSelectOption={handleSelectOption} onReset={handleReset} onBack={handleBackToCategories} />}
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      {renderContent()}
    </div>
  );
};

export default ServicePage;
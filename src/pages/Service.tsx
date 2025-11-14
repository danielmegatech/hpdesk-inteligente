import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MindmapFlow from '@/components/MindmapFlow';
import MindmapHistory from '@/components/MindmapHistory';
import { mindmapData, categories, MindmapNode } from '@/data/mindmap';
import { PlayCircle, PlusCircle, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm'; // Corrected import path
import ArticleForm from '@/components/ArticleForm'; // Corrected import path
import { Task } from '@/components/TaskForm'; // Import Task type from its new location
import { Article } from '@/components/ArticleForm'; // Import Article type from its new location
import { toast } from 'sonner';

type ServiceState = 'idle' | 'selecting_category' | 'in_flow';

const ServicePage = () => {
  const [state, setState] = useState<ServiceState>('idle');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<MindmapNode[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddKnowledgeOpen, setIsAddKnowledgeOpen] = useState(false);

  const handleStartService = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
  };

  const handleCategorySelect = (startNodeId: string) => {
    const startNode = mindmapData[startNodeId];
    setCurrentNodeId(startNodeId);
    setHistory([startNode]); // Start history with the selected category's first node
    setState('in_flow');
  };
  
  const handleReset = () => {
    setState('idle');
    setCurrentNodeId(null);
    setHistory([]);
  }

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1); // Remove current node from history
      const previousNode = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentNodeId(previousNode.id);
    } else {
      // If only one item in history, go back to category selection
      handleBackToCategories();
    }
  }

  const handleBackToCategories = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
  }

  const handleSelectOption = (nextNodeId: string | null) => {
    if (nextNodeId) {
      const nextNode = mindmapData[nextNodeId];
      setHistory([...history, nextNode]);
      setCurrentNodeId(nextNodeId);
    } else {
      // Handle null nextNodeId, e.g., if it's an end node
      setCurrentNodeId(null); // Or keep current node if it's an end node
    }
  };

  const handleEscalate = () => {
    handleSelectOption('end_escalar_tecnico');
  };

  const handleSaveNewTask = (data: Omit<Task, 'id' | 'history'>) => {
    // In a real app, this would send data to TasksPage state or a global store
    toast.success(`Tarefa "${data.title}" criada com sucesso!`);
    setIsAddTaskOpen(false);
  };

  const handleSaveNewArticle = (data: Article) => {
    // In a real app, this would send data to KnowledgeBasePage state or a global store
    toast.success(`Artigo "${data.title}" adicionado à Base de Conhecimento!`);
    setIsAddKnowledgeOpen(false);
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
            {currentNode && (
              <MindmapFlow 
                node={currentNode} 
                onSelectOption={handleSelectOption} 
                onReset={handleReset} 
                onBack={handleBack} 
                onEscalate={handleEscalate} 
              />
            )}
            <div className="flex justify-center space-x-4 mt-8">
              <Button variant="outline" onClick={() => setIsAddTaskOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Tarefa
              </Button>
              <Button variant="outline" onClick={() => setIsAddKnowledgeOpen(true)}>
                <BookOpen className="mr-2 h-4 w-4" /> Adicionar Conhecimento
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      {renderContent()}

      {/* Modals for Add Task and Add Knowledge */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Nova Tarefa</DialogTitle></DialogHeader>
          <TaskForm onSave={handleSaveNewTask} onOpenChange={setIsAddTaskOpen} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddKnowledgeOpen} onOpenChange={setIsAddKnowledgeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Novo Artigo à Base de Conhecimento</DialogTitle></DialogHeader>
          <ArticleForm onSave={handleSaveNewArticle} onOpenChange={setIsAddKnowledgeOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicePage;
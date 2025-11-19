import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categories, mindmapData, MindmapNode } from '@/data/mindmap'; // Import MindmapNode
import MindmapFlow from '@/components/MindmapFlow';
import MindmapHistory from '@/components/MindmapHistory';
import { ArrowLeft, Brain, Play, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm';
import ArticleForm from '@/components/ArticleForm';
import { dashboardMetrics, recentTickets } from '@/data/dashboard';
import DashboardCard from '@/components/DashboardCard';
import RecentTickets from '@/components/RecentTickets';
import { showSuccess, showError } from '@/utils/toast'; // Import toast utilities

const ServicePage = () => {
  const [currentMindmapNodeId, setCurrentMindmapNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<MindmapNode[]>([]); // Changed to MindmapNode[]
  const [activeServiceTitle, setActiveServiceTitle] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);

  const currentMindmapNode = currentMindmapNodeId ? mindmapData[currentMindmapNodeId] : null;

  const handleStartService = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      const startNode = mindmapData[category.startNodeId];
      setCurrentMindmapNodeId(category.startNodeId);
      setHistory([startNode]); // Store MindmapNode object
      setActiveServiceTitle(category.name);
    }
  };

  const handleSelectOption = useCallback((nextNodeId: string | null) => {
    if (nextNodeId) {
      const nextNode = mindmapData[nextNodeId];
      setCurrentMindmapNodeId(nextNodeId);
      setHistory((prev) => [...prev, nextNode]); // Store MindmapNode object
    } else {
      // This is an end node without a specific nextNodeId, indicating a resolution or action
      const node = mindmapData[currentMindmapNodeId!];
      showSuccess("Atendimento Finalizado: " + node.question); // Using showSuccess
      setCurrentMindmapNodeId(null);
      setHistory([]);
      setActiveServiceTitle(null);
    }
  }, [currentMindmapNodeId]);

  const handleBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentMindmapNodeId(newHistory[newHistory.length - 1].id); // Get ID from node
    } else {
      setCurrentMindmapNodeId(null);
      setHistory([]);
      setActiveServiceTitle(null);
    }
  }, [history]);

  const handleReset = useCallback(() => {
    setCurrentMindmapNodeId(null);
    setHistory([]);
    setActiveServiceTitle(null);
    showSuccess("Atendimento Reiniciado: O fluxo de atendimento foi reiniciado."); // Using showSuccess
  }, []);

  const handleEscalate = useCallback(() => {
    showError("Atendimento Escalonado: Um ticket de suporte foi criado e o atendimento foi escalonado para a equipa técnica."); // Using showError
    handleReset();
  }, [handleReset]);

  const handleCreateTask = () => {
    setIsTaskFormOpen(true);
  };

  const handleAddKnowledge = () => {
    setIsArticleFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-3xl font-bold mb-6">Atendimento</h1>

      {!currentMindmapNodeId && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Gerir tickets e solicitações de suporte</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {dashboardMetrics.map((metric) => (
              <DashboardCard
                key={metric.id}
                title={metric.title}
                value={metric.value}
                description={metric.description}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>
          <RecentTickets tickets={recentTickets} />
        </div>
      )}

      {currentMindmapNodeId && activeServiceTitle && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Atendimento Ativo: {activeServiceTitle}</h2>
          <div className="flex gap-2">
            <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateTask} variant="outline">Criar Tarefa</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <TaskForm
                  task={currentMindmapNode?.question ? { title: currentMindmapNode.question, description: '', status: 'pendente', location: '', time: '', priority: 'Média', hoursSpent: 0, estimatedHours: 0 } : undefined} // Adjusted props
                  onSave={() => { // Adjusted props
                    showSuccess("Tarefa criada com sucesso!");
                    setIsTaskFormOpen(false);
                  }}
                  onOpenChange={setIsTaskFormOpen} // Adjusted props
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isArticleFormOpen} onOpenChange={setIsArticleFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddKnowledge} variant="outline">Adicionar Conhecimento</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Artigo de Conhecimento</DialogTitle>
                </DialogHeader>
                <ArticleForm
                  article={currentMindmapNode?.question ? { title: currentMindmapNode.question, content: '', category: '' } : undefined} // Adjusted props
                  onSave={() => { // Adjusted props
                    showSuccess("Artigo adicionado com sucesso!");
                    setIsArticleFormOpen(false);
                  }}
                  onOpenChange={setIsArticleFormOpen} // Adjusted props
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {!currentMindmapNodeId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center p-6 text-center"
              onClick={() => handleStartService(category.id)}
            >
              <CardHeader>
                <category.icon className="h-12 w-12 text-primary mb-2" />
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="mt-4">
                  <Play className="mr-2 h-4 w-4" /> Iniciar Atendimento
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <MindmapHistory history={history} /> {/* history is now MindmapNode[] */}
          {currentMindmapNode && (
            <MindmapFlow
              node={currentMindmapNode}
              onSelectOption={handleSelectOption}
              onReset={handleReset}
              onBack={handleBack}
              onEscalate={handleEscalate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ServicePage;
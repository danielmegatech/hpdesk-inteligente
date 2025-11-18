import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MindmapFlow from '@/components/MindmapFlow';
import MindmapHistory from '@/components/MindmapHistory';
import { mindmapData, categories, MindmapNode } from '@/data/mindmap';
import { PlayCircle, PlusCircle, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm, { Task } from '@/components/TaskForm'; // Corrected import path
import ArticleForm, { Article } from '@/components/ArticleForm'; // Corrected import path
import { toast } from 'sonner';
import ActiveServiceCard from '@/components/ActiveServiceCard'; // Import ActiveServiceCard
import { apiAddTask, apiAddArticle, apiGetArticles } from '@/api'; // Import mock API
import { useSession } from '@/components/SessionContextProvider'; // Import useSession

type ServiceState = 'idle' | 'selecting_category' | 'in_flow';

const ServicePage = () => {
  const { user } = useSession();
  const currentUserId = user?.id || 'anonymous_user_id';
  
  const [state, setState] = useState<ServiceState>('idle');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<MindmapNode[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddKnowledgeOpen, setIsAddKnowledgeOpen] = useState(false);
  const [activeServiceStatus, setActiveServiceStatus] = useState<'active' | 'resolved' | 'escalated'>('active');
  const [escalatedResolver, setEscalatedResolver] = useState<string | undefined>(undefined);
  const [kbSuggestions, setKbSuggestions] = useState<Article[]>([]);

  // State for initial form data when triggered from Service page
  const [initialTaskTitle, setInitialTaskTitle] = useState<string | undefined>(undefined);
  const [initialArticleTitle, setInitialArticleTitle] = useState<string | undefined>(undefined);


  const handleStartService = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
    setActiveServiceStatus('active');
    setEscalatedResolver(undefined);
    setKbSuggestions([]);
    setInitialTaskTitle(undefined);
    setInitialArticleTitle(undefined);
  };

  const handleCategorySelect = (startNodeId: string) => {
    const startNode = mindmapData[startNodeId];
    setCurrentNodeId(startNodeId);
    setHistory([startNode]); // Start history with the selected category's first node
    setState('in_flow');
    setActiveServiceStatus('active');
    setKbSuggestions([]);
    setInitialTaskTitle(undefined);
    setInitialArticleTitle(undefined);
  };
  
  const handleReset = () => {
    setState('idle');
    setCurrentNodeId(null);
    setHistory([]);
    setActiveServiceStatus('resolved'); // Mark as resolved when resetting
    setEscalatedResolver(undefined);
    setKbSuggestions([]);
    setInitialTaskTitle(undefined);
    setInitialArticleTitle(undefined);
  }

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1); // Remove current node from history
      const previousNode = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentNodeId(previousNode.id);
      setActiveServiceStatus('active');
      setKbSuggestions([]);
    } else {
      // If only one item in history, go back to category selection
      handleBackToCategories();
    }
  }

  const handleBackToCategories = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
    setActiveServiceStatus('active');
    setKbSuggestions([]);
  }

  const handleSelectOption = (nextNodeId: string | null) => {
    if (nextNodeId) {
      const nextNode = mindmapData[nextNodeId];
      setHistory([...history, nextNode]);
      setCurrentNodeId(nextNodeId);
      if (nextNode.id.startsWith('end_')) {
        if (nextNode.id === 'end_escalar_tecnico') {
          setActiveServiceStatus('escalated');
          setEscalatedResolver('Técnico Especializado'); // Simulate who resolved it
        } else {
          setActiveServiceStatus('resolved');
        }
        // Suggest KB articles if it's an end node that isn't a direct resolution
        if (nextNode.id !== 'end_success' && nextNode.id !== 'end_escalar_tecnico') {
          const relevantArticles = apiGetArticles().filter(article => 
            nextNode.question.toLowerCase().includes(article.category.toLowerCase()) ||
            article.content.toLowerCase().includes(nextNode.question.toLowerCase()) ||
            article.title.toLowerCase().includes(nextNode.question.toLowerCase())
          ).slice(0, 3); // Limit to 3 suggestions
          setKbSuggestions(relevantArticles);
        } else {
          setKbSuggestions([]);
        }
      } else {
        setActiveServiceStatus('active');
        setKbSuggestions([]);
      }
    } else {
      setCurrentNodeId(null);
      setActiveServiceStatus('resolved');
      setKbSuggestions([]);
    }
  };

  const handleEscalate = () => {
    handleSelectOption('end_escalar_tecnico');
  };

  const handleSaveNewTask = async (data: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt'>) => {
    if (!user) return;
    const newTask = await apiAddTask(data, currentUserId);
    if (newTask) {
      toast.success(`Tarefa "${data.title}" criada com sucesso!`);
    }
    setIsAddTaskOpen(false);
    setInitialTaskTitle(undefined); // Clear after saving
  };

  const handleSaveNewArticle = (data: Omit<Article, 'id'>) => {
    apiAddArticle(data);
    toast.success(`Artigo "${data.title}" adicionado à Base de Conhecimento!`);
    setIsAddKnowledgeOpen(false);
    setInitialArticleTitle(undefined); // Clear after saving
  };

  const getCategorySubthemes = (categoryId: string) => {
    const startNodeId = categories.find(cat => cat.id === categoryId)?.startNodeId;
    if (!startNodeId) return '';
    const startNode = mindmapData[startNodeId];
    
    // Check if startNode exists before accessing its properties
    if (!startNode) return 'Nenhum subtema definido.'; 
    
    return startNode.options.map(opt => opt.text).join(', ');
  };

  const handleOpenAddTask = () => {
    if (currentNodeId) {
      setInitialTaskTitle(mindmapData[currentNodeId].question);
    }
    setIsAddTaskOpen(true);
  };

  const handleOpenAddKnowledge = () => {
    if (currentNodeId) {
      setInitialArticleTitle(mindmapData[currentNodeId].question);
    }
    setIsAddKnowledgeOpen(true);
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
            <div className="flex justify-center gap-4">
              <Button onClick={handleStartService} size="lg">
                <PlayCircle className="mr-2 h-6 w-6" />
                Iniciar Atendimento
              </Button>
            </div>
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
                  title={getCategorySubthemes(cat.id)} // Subthemes on hover
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
            <ActiveServiceCard history={history} status={activeServiceStatus} escalatedTo={escalatedResolver} />
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
              <Button variant="outline" onClick={handleOpenAddTask}>
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Tarefa
              </Button>
              <Button variant="outline" onClick={handleOpenAddKnowledge}>
                <BookOpen className="mr-2 h-4 w-4" /> Adicionar Conhecimento
              </Button>
            </div>

            {kbSuggestions.length > 0 && (
              <div className="mt-8 p-4 border rounded-lg bg-card shadow-sm animate-in fade-in slide-in-from-bottom-5">
                <h3 className="text-lg font-semibold mb-3">Sugestões da Base de Conhecimento:</h3>
                <ul className="space-y-2">
                  {kbSuggestions.map(article => (
                    <li key={article.id} className="text-sm text-muted-foreground">
                      <BookOpen className="inline-block h-4 w-4 mr-2" />
                      <strong>{article.title}</strong> ({article.category})
                      <p className="ml-6 text-xs italic line-clamp-2">{article.content}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          <TaskForm 
            task={initialTaskTitle ? { title: initialTaskTitle, description: '', status: 'novo', location: '', time: '' } : undefined} 
            onSave={handleSaveNewTask} 
            onOpenChange={setIsAddTaskOpen} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddKnowledgeOpen} onOpenChange={setIsAddKnowledgeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Novo Artigo à Base de Conhecimento</DialogTitle></DialogHeader>
          <ArticleForm 
            article={initialArticleTitle ? { title: initialArticleTitle, content: '', category: '' } : undefined} 
            onSave={handleSaveNewArticle} 
            onOpenChange={setIsAddKnowledgeOpen} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicePage;
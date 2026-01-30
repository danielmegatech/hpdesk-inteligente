import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MindmapFlow from '@/components/MindmapFlow';
import MindmapHistory from '@/components/MindmapHistory';
import { mindmapData, categories, MindmapNode } from '@/data/mindmap';
import { PlayCircle, PlusCircle, BookOpen, Search, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import TaskForm, { Task } from '@/components/TaskForm';
import ArticleForm, { Article } from '@/components/ArticleForm';
import { toast } from 'sonner';
import ActiveServiceCard from '@/components/ActiveServiceCard';
import { apiAddTask, apiAddArticle, apiGetArticles, apiAddNotification } from '@/api';
import { useSession } from '@/components/SessionContextProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type ServiceState = 'idle' | 'selecting_category' | 'in_flow';

const getCategorySubthemes = (startNodeId: string) => {
  const startNode = mindmapData[startNodeId];
  if (!startNode) return 'Nenhum subtema definido.'; 
  
  return startNode.options.map(opt => opt.text).join(', ');
};

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
  const [initialTaskDescription, setInitialTaskDescription] = useState<string | undefined>(undefined); // New state for description
  const [initialArticleTitle, setInitialArticleTitle] = useState<string | undefined>(undefined);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);


  const handleStartService = () => {
    setState('selecting_category');
    setCurrentNodeId(null);
    setHistory([]);
    setActiveServiceStatus('active');
    setEscalatedResolver(undefined);
    setKbSuggestions([]);
    setInitialTaskTitle(undefined);
    setInitialTaskDescription(undefined);
    setInitialArticleTitle(undefined);
  };

  const handleCategorySelect = (startNodeId: string) => {
    const startNode = mindmapData[startNodeId];
    setCurrentNodeId(startNodeId);
    setHistory([startNode]);
    setState('in_flow');
    setActiveServiceStatus('active');
    setKbSuggestions([]);
    setInitialTaskTitle(undefined);
    setInitialTaskDescription(undefined);
    setInitialArticleTitle(undefined);
    setIsSearchDialogOpen(false); // Close dialog if opened via search
  };
  
  const handleReset = () => {
    setState('idle');
    setCurrentNodeId(null);
    setHistory([]);
    setActiveServiceStatus('resolved');
    setEscalatedResolver(undefined);
    setKbSuggestions([]);
    setInitialTaskTitle(undefined);
    setInitialTaskDescription(undefined);
    setInitialArticleTitle(undefined);
  }

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousNode = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentNodeId(previousNode.id);
      setActiveServiceStatus('active');
      setKbSuggestions([]);
    } else {
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
          setEscalatedResolver('Técnico Especializado');
        } else {
          setActiveServiceStatus('resolved');
        }
        if (nextNode.id !== 'end_success' && nextNode.id !== 'end_escalar_tecnico') {
          const relevantArticles = apiGetArticles().filter(article => 
            nextNode.question.toLowerCase().includes(article.category.toLowerCase()) ||
            article.content.toLowerCase().includes(nextNode.question.toLowerCase()) ||
            article.title.toLowerCase().includes(nextNode.question.toLowerCase())
          ).slice(0, 3);
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
      apiAddNotification({
        message: `Nova tarefa no Inbox: "${data.title}"`,
        description: `Atribuída a você.`,
        type: 'info',
        link: '/tasks'
      });
    }
    setIsAddTaskOpen(false);
    setInitialTaskTitle(undefined);
    setInitialTaskDescription(undefined);
  };

  const handleSaveNewArticle = (data: Omit<Article, 'id'>) => {
    apiAddArticle(data);
    toast.success(`Artigo "${data.title}" adicionado à Base de Conhecimento!`);
    setIsAddKnowledgeOpen(false);
    setInitialArticleTitle(undefined);
  };

  const handleOpenAddTask = () => {
    if (currentNodeId) {
      const currentQuestion = mindmapData[currentNodeId].question;
      const historyDescription = history.map(node => node.question).join(' -> ');
      setInitialTaskTitle(currentQuestion);
      setInitialTaskDescription(`Fluxo: ${historyDescription}`);
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
              <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Search className="mr-2 h-6 w-6" />
                    Buscar Atendimento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Buscar Tema de Atendimento</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {categories.map((cat) => (
                        <Card 
                          key={cat.id} 
                          className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => handleCategorySelect(cat.startNodeId)}
                        >
                          <CardHeader className="p-0 pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <cat.icon className="h-5 w-5 text-primary" />
                              {cat.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 text-sm text-muted-foreground flex items-center">
                            <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {getCategorySubthemes(cat.startNodeId)}
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsSearchDialogOpen(false)}>Fechar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  title={getCategorySubthemes(cat.startNodeId)}
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
        const isUnresolvedEndNode = currentNode?.id.startsWith('end_') && currentNode.id !== 'end_success';

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
              {isUnresolvedEndNode && (
                <Button onClick={handleOpenAddTask} className="bg-red-600 hover:bg-red-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" /> Criar Tarefa (Atendimento Não Resolvido)
                </Button>
              )}
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
            task={initialTaskTitle ? { title: initialTaskTitle, description: initialTaskDescription, status: 'pendente', location: '', time: '', priority: 'Média', assignee: user?.email || 'Não Atribuído' } : undefined} 
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
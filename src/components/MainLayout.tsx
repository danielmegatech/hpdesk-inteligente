import { NavLink, Outlet } from 'react-router-dom';
import { Home, ListTodo, BarChart3, BrainCircuit, Settings as SettingsIcon, Menu, Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from './made-with-dyad';
import { AICommandBar } from './AICommandBar';
import { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NotificationBell from './NotificationBell';
import { apiGetTasks, apiAddNotification, apiAddTask, apiAddArticle } from '@/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm';
import ArticleForm from '@/components/ArticleForm';
import { useMindmap } from '@/context/MindmapContext';

const navItems = [
  { to: '/', label: 'Atendimento', icon: Home },
  { to: '/tasks', label: 'Tarefas', icon: ListTodo },
  { to: '/reports', label: 'Relatórios', icon: BarChart3 },
  { to: '/kb', label: 'Base de Conhecimento', icon: BrainCircuit },
  { to: '/settings', label: 'Ajustes', icon: SettingsIcon },
];

const NavContent = () => (
  <nav className="flex flex-col p-4 space-y-2">
    {navItems.map((item) => (
      <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center p-2 rounded-lg transition-colors ${ isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground' }`} end>
        <item.icon className="w-5 h-5 mr-3" />{item.label}
      </NavLink>
    ))}
  </nav>
);

const MainLayout = () => {
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const { settings } = useSettings();
  const { mindmapData, setMindmapData } = useMindmap();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddTaskOpenFromAI, setIsAddTaskOpenFromAI] = useState(false);
  const [initialTaskDataFromAI, setInitialTaskDataFromAI] = useState<{ title?: string; description?: string } | undefined>(undefined);
  const [isAddKnowledgeOpenFromAI, setIsAddKnowledgeOpenFromAI] = useState(false);
  const [initialArticleDataFromAI, setInitialArticleDataFromAI] = useState<{ title?: string; content?: string; category?: string } | undefined>(undefined);

  const handleTriggerAddTaskFromAI = (title?: string, description?: string) => {
    setInitialTaskDataFromAI({ title, description });
    setIsAddTaskOpenFromAI(true);
  };

  const handleTriggerAddKnowledgeFromAI = (title?: string, content?: string, category?: string) => {
    setInitialArticleDataFromAI({ title, content, category });
    setIsAddKnowledgeOpenFromAI(true);
  };

  const handleExportFlow = () => {
    const dataStr = JSON.stringify(mindmapData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fluxo_de_trabalho.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('O download do fluxo de trabalho foi iniciado.');
  };

  const handleTriggerImportFlow = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast.error('Por favor, selecione um ficheiro .json válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const parsedData = JSON.parse(content);
          // Basic validation
          if (typeof parsedData === 'object' && !Array.isArray(parsedData) && Object.keys(parsedData).length > 0) {
            setMindmapData(parsedData);
            toast.success('Fluxo de trabalho importado com sucesso!');
          } else {
            throw new Error('Formato de JSON inválido.');
          }
        }
      } catch (error) {
        console.error('Failed to import file:', error);
        toast.error('Falha ao importar o ficheiro. Verifique o formato do JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  useEffect(() => {
    const checkWorkHoursAndTasks = async () => {
      const now = new Date();
      const today = now.toDateString();
      const [startHour, startMinute] = settings.workStartTime.split(':').map(Number);
      const [endHour, endMinute] = settings.workEndTime.split(':').map(Number);
      
      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      if (now >= startTime && now <= endTime) {
        const lastShown = localStorage.getItem('welcome-notification-date');
        if (lastShown !== today) {
          apiAddNotification({ message: 'Bem-vindo ao seu turno!', description: 'Tenha um ótimo dia de trabalho.', type: 'info' });
          localStorage.setItem('welcome-notification-date', today);
        }
      }

      const allTasks = await apiGetTasks();
      allTasks.forEach(task => {
        if (task.deadline && task.status !== 'concluido' && task.status !== 'lixeira') {
          const diff = task.deadline.getTime() - now.getTime();
          const oneDay = 86400000;

          if (diff > 0 && diff <= oneDay && !localStorage.getItem(`deadline-notified-${task.id}-${today}`)) {
            apiAddNotification({ 
              message: `Prazo a aproximar: "${task.title}"`, 
              description: `Vence em ${formatDistanceToNow(task.deadline, { addSuffix: true, locale: ptBR })}.`, 
              type: 'warning',
              link: `/tasks?highlight=${task.id}`
            });
            localStorage.setItem(`deadline-notified-${task.id}-${today}`, 'true');
          } else if (diff <= 0 && !localStorage.getItem(`overdue-notified-${task.id}-${today}`)) {
            apiAddNotification({ 
              message: `Tarefa atrasada: "${task.title}"`, 
              description: `Venceu ${formatDistanceToNow(task.deadline, { addSuffix: true, locale: ptBR })}.`, 
              type: 'error',
              link: `/tasks?highlight=${task.id}`
            });
            localStorage.setItem(`overdue-notified-${task.id}-${today}`, 'true');
          }
        }
      });
    };

    checkWorkHoursAndTasks();
    const intervalId = setInterval(checkWorkHoursAndTasks, 3600000);

    return () => clearInterval(intervalId);
  }, [settings]);

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
      <AICommandBar 
        open={commandBarOpen} 
        onOpenChange={setCommandBarOpen} 
        onTriggerAddTask={handleTriggerAddTaskFromAI}
        onTriggerAddKnowledge={handleTriggerAddKnowledgeFromAI}
        onTriggerExportFlow={handleExportFlow}
        onTriggerImportFlow={handleTriggerImportFlow}
      />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6"><a href="/" className="flex items-center gap-2 font-semibold"><BrainCircuit className="h-6 w-6" /><span>Helpdesk App</span></a></div>
            <div className="flex-1"><NavContent /></div>
            <div className="mt-auto p-4"><MadeWithDyad /></div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet><SheetTrigger asChild><Button variant="outline" size="icon" className="shrink-0 md:hidden"><Menu className="h-5 w-5" /><span className="sr-only">Toggle navigation menu</span></Button></SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                 <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6"><a href="/" className="flex items-center gap-2 font-semibold"><BrainCircuit className="h-6 w-6" /><span>Helpdesk App</span></a></div>
                <NavContent />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex justify-end items-center gap-4">
              <NotificationBell />
              <Button variant="outline" size="sm" className="gap-1.5 text-sm" onClick={() => setCommandBarOpen(true)}><Bot className="h-4 w-4" />Assistente IA</Button>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto"><Outlet /></main>
        </div>
      </div>

      <Dialog open={isAddTaskOpenFromAI} onOpenChange={setIsAddTaskOpenFromAI}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Nova Tarefa (via Assistente IA)</DialogTitle></DialogHeader>
          <TaskForm 
            task={initialTaskDataFromAI} 
            onSave={async (data) => {
              await apiAddTask(data);
              toast.success(`Tarefa "${data.title}" criada com sucesso!`);
              setIsAddTaskOpenFromAI(false);
              setInitialTaskDataFromAI(undefined);
            }} 
            onOpenChange={setIsAddTaskOpenFromAI} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddKnowledgeOpenFromAI} onOpenChange={setIsAddKnowledgeOpenFromAI}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Novo Artigo (via Assistente IA)</DialogTitle></DialogHeader>
          <ArticleForm 
            article={initialArticleDataFromAI} 
            onSave={async (data) => {
              await apiAddArticle(data);
              toast.success(`Artigo "${data.title}" adicionado à Base de Conhecimento!`);
              setIsAddKnowledgeOpenFromAI(false);
              setInitialArticleDataFromAI(undefined);
            }} 
            onOpenChange={setIsAddKnowledgeOpenFromAI} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MainLayout;
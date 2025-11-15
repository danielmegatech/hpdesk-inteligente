import { NavLink, Outlet } from 'react-router-dom';
import { Home, ListTodo, BarChart3, BrainCircuit, Settings as SettingsIcon, Menu, Bot, LogOut, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from './made-with-dyad';
import { AICommandBar } from './AICommandBar';
import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { Task } from '@/components/TaskForm'; // Import Task type
import { formatDistanceToNow } from 'date-fns'; // Import formatDistanceToNow
import { ptBR } from 'date-fns/locale'; // Import ptBR locale
import NotificationBell from './NotificationBell'; // Import NotificationBell
import { apiGetTasks, apiAddNotification, apiAddTask, apiAddArticle } from '@/api'; // Import mock API e as funções em falta
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Importando componentes Dialog
import TaskForm from '@/components/TaskForm'; // Importando TaskForm
import ArticleForm from '@/components/ArticleForm'; // Importando ArticleForm
import { mindmapData } from '@/data/mindmap';
import { useSession } from './SessionContextProvider'; // Import useSession
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

const navItems = [
  { to: '/', label: 'Atendimento', icon: Home },
  { to: '/tasks', label: 'Tarefas', icon: ListTodo },
  { to: '/reports', label: 'Relatórios', icon: BarChart3 },
  { to: '/kb', label: 'Base de Conhecimento', icon: BrainCircuit },
  { to: '/settings', label: 'Ajustes', icon: SettingsIcon },
];

const NavContent = ({ handleLogout, userEmail }: { handleLogout: () => void, userEmail: string | null }) => (
  <nav className="flex flex-col p-4 space-y-2">
    {navItems.map((item) => (
      <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center p-2 rounded-lg transition-colors ${ isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground' }`} end>
        <item.icon className="w-5 h-5 mr-3" />{item.label}
      </NavLink>
    ))}
    {userEmail && (
      <Button variant="ghost" className="w-full justify-start mt-4" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" /> Sair ({userEmail})
      </Button>
    )}
  </nav>
);

const MainLayout = () => {
  const { user, isLoading } = useSession();
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const { settings } = useSettings();

  // State and functions to trigger modals from AI Command Bar
  const [isAddTaskOpenFromAI, setIsAddTaskOpenFromAI] = useState(false);
  const [initialTaskDataFromAI, setInitialTaskDataFromAI] = useState<{ title?: string; description?: string } | undefined>(undefined);
  const [isAddKnowledgeOpenFromAI, setIsAddKnowledgeOpenFromAI] = useState(false);
  const [initialArticleDataFromAI, setInitialArticleDataFromAI] = useState<{ title?: string; content?: string; category?: string } | undefined>(undefined);

  // We no longer return null if !user, allowing direct access.
  // However, we need a placeholder user ID for API calls if not logged in.
  const currentUserId = user?.id || 'anonymous_user_id';
  const userEmail = user?.email || 'Convidado';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao sair: ' + error.message);
    } else {
      toast.success('Sessão encerrada com sucesso.');
    }
  };

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
    navigator.clipboard.writeText(dataStr)
      .then(() => {
        toast.success('Fluxo de trabalho copiado para a área de transferência!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Falha ao copiar o fluxo de trabalho.');
      });
  };

  useEffect(() => {
    if (currentUserId === 'anonymous_user_id') return; // Skip notifications for anonymous access

    const checkWorkHoursAndTasks = async () => {
      const now = new Date();
      const today = now.toDateString();
      const [startHour, startMinute] = settings.workStartTime.split(':').map(Number);
      const [endHour, endMinute] = settings.workEndTime.split(':').map(Number);
      
      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      // Welcome notification
      if (now >= startTime && now <= endTime) {
        const lastShown = localStorage.getItem('welcome-notification-date');
        if (lastShown !== today) {
          apiAddNotification({ message: 'Bem-vindo ao seu turno!', description: 'Tenha um ótimo dia de trabalho.', type: 'info' });
          localStorage.setItem('welcome-notification-date', today);
        }
      }

      // Task deadline notifications (using Supabase API)
      const allTasks = await apiGetTasks(currentUserId); // Use currentUserId
      allTasks.forEach(task => {
        if (task.deadline && task.status !== 'concluido' && task.status !== 'lixeira') {
          const diff = task.deadline.getTime() - now.getTime();
          const oneDay = 86400000; // milliseconds in a day

          if (diff > 0 && diff <= oneDay && !localStorage.getItem(`deadline-notified-${task.id}-${today}`)) {
            apiAddNotification({ 
              message: `Prazo a aproximar: "${task.title}"`, 
              description: `Vence em ${formatDistanceToNow(task.deadline, { addSuffix: true, locale: ptBR })}.`, 
              type: 'warning',
              link: `/tasks?highlight=${task.id}` // Link to tasks page, highlight specific task
            });
            localStorage.setItem(`deadline-notified-${task.id}-${today}`, 'true');
          } else if (diff <= 0 && !localStorage.getItem(`overdue-notified-${task.id}-${today}`)) {
            apiAddNotification({ 
              message: `Tarefa atrasada: "${task.title}"`, 
              description: `Venceu ${formatDistanceToNow(task.deadline, { addSuffix: true, locale: ptBR })}.`, 
              type: 'error',
              link: `/tasks?highlight=${task.id}` // Link to tasks page, highlight specific task
            });
            localStorage.setItem(`overdue-notified-${task.id}-${today}`, 'true');
          }
        }
      });
    };

    // Run once on mount and then every hour
    checkWorkHoursAndTasks();
    const intervalId = setInterval(checkWorkHoursAndTasks, 3600000); // Check every hour

    return () => clearInterval(intervalId);
  }, [settings, currentUserId]);

  return (
    <>
      <AICommandBar 
        open={commandBarOpen} 
        onOpenChange={setCommandBarOpen} 
        onTriggerAddTask={handleTriggerAddTaskFromAI}
        onTriggerAddKnowledge={handleTriggerAddKnowledgeFromAI}
        onTriggerExportFlow={handleExportFlow}
      />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6"><a href="/" className="flex items-center gap-2 font-semibold"><BrainCircuit className="h-6 w-6" /><span>Helpdesk App</span></a></div>
            <div className="flex-1"><NavContent handleLogout={handleLogout} userEmail={user?.email || null} /></div>
            <div className="mt-auto p-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{userEmail}</span>
                </div>
                {user && (
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <MadeWithDyad />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet><SheetTrigger asChild><Button variant="outline" size="icon" className="shrink-0 md:hidden"><Menu className="h-5 w-5" /><span className="sr-only">Toggle navigation menu</span></Button></SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                 <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6"><a href="/" className="flex items-center gap-2 font-semibold"><BrainCircuit className="h-6 w-6" /><span>Helpdesk App</span></a></div>
                <NavContent handleLogout={handleLogout} userEmail={user?.email || null} />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex justify-end items-center gap-4">
              <NotificationBell /> {/* Notification Bell */}
              <Button variant="outline" size="sm" className="gap-1.5 text-sm" onClick={() => setCommandBarOpen(true)}><Bot className="h-4 w-4" />Assistente IA</Button>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto"><Outlet /></main>
        </div>
      </div>

      {/* Modals for Add Task and Add Knowledge triggered by AI Command Bar */}
      <Dialog open={isAddTaskOpenFromAI} onOpenChange={setIsAddTaskOpenFromAI}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Nova Tarefa (via Assistente IA)</DialogTitle></DialogHeader>
          <TaskForm 
            task={initialTaskDataFromAI} 
            onSave={async (data) => { // Made async
              await apiAddTask(data, currentUserId); // Pass currentUserId
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
            onSave={async (data) => { // Made async
              await apiAddArticle(data); // Await the API call
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
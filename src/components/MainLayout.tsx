import { NavLink, Outlet } from 'react-router-dom';
import { Home, ListTodo, BarChart3, BrainCircuit, Settings as SettingsIcon, Menu, Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from './made-with-dyad';
import { AICommandBar } from './AICommandBar';
import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';

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

  useEffect(() => {
    const checkWorkHours = () => {
      const now = new Date();
      const [startHour, startMinute] = settings.workStartTime.split(':').map(Number);
      const [endHour, endMinute] = settings.workEndTime.split(':').map(Number);
      
      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      if (now >= startTime && now <= endTime) {
        // Check if notification was already shown today
        const lastShown = localStorage.getItem('welcome-notification-date');
        const today = new Date().toDateString();
        if (lastShown !== today) {
          toast.info('Bem-vindo ao seu turno!', { description: 'Tenha um ótimo dia de trabalho.' });
          localStorage.setItem('welcome-notification-date', today);
        }
      }
    };
    checkWorkHours();
  }, [settings]);

  return (
    <>
      <AICommandBar open={commandBarOpen} onOpenChange={setCommandBarOpen} />
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
            <div className="w-full flex-1"><Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm" onClick={() => setCommandBarOpen(true)}><Bot className="h-4 w-4" />Assistente IA</Button></div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto"><Outlet /></main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
import { Task } from '@/components/TaskForm';
import { Article } from '@/components/ArticleForm';
import { format } from 'date-fns';

// --- Mock Data Storage (using localStorage for persistence) ---
const getTasks = (): Task[] => {
  const storedTasks = localStorage.getItem('mockTasks');
  return storedTasks ? JSON.parse(storedTasks).map((task: any) => ({
    ...task,
    deadline: task.deadline ? new Date(task.deadline) : undefined,
    history: task.history.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })),
  })) : [];
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('mockTasks', JSON.stringify(tasks));
};

const getArticles = (): Article[] => {
  const storedArticles = localStorage.getItem('mockArticles');
  return storedArticles ? JSON.parse(storedArticles) : [];
};

const saveArticles = (articles: Article[]) => {
  localStorage.setItem('mockArticles', JSON.stringify(articles));
};

// --- Initial Data (if localStorage is empty) ---
let tasks: Task[] = getTasks();
if (tasks.length === 0) {
  tasks = [
    { id: 'task-1', title: 'Verificar backup do servidor', description: 'Garantir que o backup noturno foi concluído.', status: 'novo', history: [{ status: 'novo', timestamp: new Date() }], location: 'Sala de Servidores', time: '10:00', createdAt: new Date(), updatedAt: new Date() },
    { id: 'task-2', title: 'Reset de palavra-passe para utilizador', description: 'Utilizador: joao.silva', status: 'emAndamento', deadline: new Date(Date.now() + 86400000), history: [{ status: 'novo', timestamp: new Date(Date.now() - 3600000) }, { status: 'emAndamento', timestamp: new Date() }], location: 'Remoto', time: '14:30', createdAt: new Date(Date.now() - 3600000), updatedAt: new Date() },
    { id: 'task-3', title: 'Trocar toner da impressora', description: 'Modelo HP LaserJet Pro M404dn', status: 'concluido', history: [{ status: 'novo', timestamp: new Date(Date.now() - 86400000) }, { status: 'emAndamento', timestamp: new Date(Date.now() - 7200000) }, { status: 'concluido', timestamp: new Date() }], location: 'Escritório 3º Andar', time: '11:00', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(), completedAt: new Date() },
    { id: 'task-4', title: 'Aguardar aprovação para compra de licença', description: 'Licença do software X para o departamento Y.', status: 'pendenteAutorizacaoEscalado', history: [{ status: 'novo', timestamp: new Date(Date.now() - 172800000) }, { status: 'pendenteAutorizacaoEscalado', timestamp: new Date(Date.now() - 86400000) }], location: 'Financeiro', time: '17:00', createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 86400000) },
  ];
  saveTasks(tasks);
}

let articles: Article[] = getArticles();
if (articles.length === 0) {
  articles = [
    { id: 'kb-1', title: 'Como configurar a impressora de rede?', content: '1. Abra o Painel de Controlo...\n2. Vá em "Dispositivos e Impressoras"...\n3. Clique em "Adicionar uma impressora"...', category: 'Hardware' },
    { id: 'kb-2', title: 'Como aceder à VPN da empresa?', content: 'Abra o cliente Cisco AnyConnect...\nDigite o endereço vpn.suaempresa.com.pt...', category: 'Rede' },
    { id: 'kb-3', title: 'O que fazer quando um software bloqueia?', content: 'Primeiro, tente fechar o programa pelo Gestor de Tarefas (Ctrl+Shift+Esc).', category: 'Software' },
    { id: 'kb-4', title: 'Guia de Segurança de Palavras-passe', content: 'Use palavras-passe fortes e únicas. Não partilhe as suas palavras-passe.', category: 'Segurança' },
  ];
  saveArticles(articles);
}

// --- Task API ---
export const apiGetTasks = (): Task[] => {
  return getTasks();
};

export const apiAddTask = (newTaskData: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt'>): Task => {
  const currentTasks = getTasks();
  const newTask: Task = {
    ...newTaskData,
    id: `task-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: [{ status: newTaskData.status, timestamp: new Date() }],
  };
  saveTasks([...currentTasks, newTask]);
  return newTask;
};

export const apiUpdateTask = (updatedTaskData: Task): Task => {
  const currentTasks = getTasks();
  const updatedTasks = currentTasks.map(task => {
    if (task.id === updatedTaskData.id) {
      const newHistory = [...task.history];
      // Add new history entry only if status changed
      if (task.status !== updatedTaskData.status) {
        newHistory.push({ status: updatedTaskData.status, timestamp: new Date() });
      }
      return {
        ...updatedTaskData,
        updatedAt: new Date(),
        completedAt: updatedTaskData.status === 'concluido' ? new Date() : undefined,
        history: newHistory,
      };
    }
    return task;
  });
  saveTasks(updatedTasks);
  return updatedTaskData;
};

export const apiDeleteTask = (taskId: string) => {
  const currentTasks = getTasks();
  const updatedTasks = currentTasks.filter(task => task.id !== taskId);
  saveTasks(updatedTasks);
};

// --- Article API ---
export const apiGetArticles = (): Article[] => {
  return getArticles();
};

export const apiAddArticle = (newArticleData: Omit<Article, 'id'>): Article => {
  const currentArticles = getArticles();
  const newArticle: Article = {
    ...newArticleData,
    id: `kb-${Date.now()}`,
  };
  saveArticles([...currentArticles, newArticle]);
  return newArticle;
};

export const apiUpdateArticle = (updatedArticleData: Article): Article => {
  const currentArticles = getArticles();
  const updatedArticles = currentArticles.map(article =>
    article.id === updatedArticleData.id ? updatedArticleData : article
  );
  saveArticles(updatedArticles);
  return updatedArticleData;
};

export const apiDeleteArticle = (articleId: string) => {
  const currentArticles = getArticles();
  const updatedArticles = currentArticles.filter(article => article.id !== articleId);
  saveArticles(updatedArticles);
};

// --- Report Metrics API ---
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle } from 'lucide-react';

export const apiGetReportMetrics = () => {
  const currentTasks = getTasks();
  const currentArticles = getArticles();
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  const tasksConcludedToday = currentTasks.filter(t => t.status === 'concluido' && t.completedAt && format(t.completedAt, 'yyyy-MM-dd') === today).length;
  const totalTasks = currentTasks.length;
  const openTasks = currentTasks.filter(t => t.status !== 'concluido' && t.status !== 'lixeira').length;
  const escalatedTasks = currentTasks.filter(t => t.status === 'pendenteAutorizacaoEscalado').length;
  const articlesAddedThisMonth = currentArticles.filter(a => {
    // This is a simplification, in a real app articles would have a createdAt field
    // For now, we'll just count all articles as if they were added this month for demo purposes
    return true; 
  }).length;

  // Simulate average resolution time (very basic for demo)
  const resolvedTasksWithTime = currentTasks.filter(t => t.status === 'concluido' && t.createdAt && t.completedAt);
  const totalResolutionTime = resolvedTasksWithTime.reduce((sum, t) => {
    const created = t.createdAt?.getTime() || 0;
    const completed = t.completedAt?.getTime() || 0;
    return sum + (completed - created); // time in milliseconds
  }, 0);
  const avgResolutionTimeMs = resolvedTasksWithTime.length > 0 ? totalResolutionTime / resolvedTasksWithTime.length : 0;
  const avgResolutionTimeMinutes = Math.round(avgResolutionTimeMs / (1000 * 60));

  return [
    { title: 'Tickets Resolvidos (Hoje)', value: tasksConcludedToday.toString(), change: '+2', icon: CheckCircle },
    { title: 'Tickets Abertos', value: openTasks.toString(), change: '-1', icon: GitBranch },
    { title: 'Tickets Escalados', value: escalatedTasks.toString(), change: '+1', icon: AlertTriangle },
    { title: 'Artigos KB Adicionados', value: articlesAddedThisMonth.toString(), change: '+2', icon: BookOpen },
    { title: 'Tempo Médio de Resolução', value: `${avgResolutionTimeMinutes} min`, change: '-5 min', icon: XCircle },
  ];
};

// --- Notification API (for floating menu) ---
export interface AppNotification {
  id: string;
  message: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

const getNotifications = (): AppNotification[] => {
  const storedNotifications = localStorage.getItem('appNotifications');
  return storedNotifications ? JSON.parse(storedNotifications).map((n: any) => ({
    ...n,
    timestamp: new Date(n.timestamp),
  })) : [];
};

const saveNotifications = (notifications: AppNotification[]) => {
  localStorage.setItem('appNotifications', JSON.stringify(notifications));
};

export const apiGetNotifications = (): AppNotification[] => {
  return getNotifications();
};

export const apiAddNotification = (notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification => {
  const currentNotifications = getNotifications();
  const newNotification: AppNotification = {
    ...notificationData,
    id: `notif-${Date.now()}`,
    timestamp: new Date(),
    read: false,
  };
  saveNotifications([newNotification, ...currentNotifications]); // Add new to top
  return newNotification;
};

export const apiMarkNotificationAsRead = (notificationId: string) => {
  const currentNotifications = getNotifications();
  const updatedNotifications = currentNotifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(updatedNotifications);
};

export const apiDeleteNotification = (notificationId: string) => {
  const currentNotifications = getNotifications();
  const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
  saveNotifications(updatedNotifications);
};
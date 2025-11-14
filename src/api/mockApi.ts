import { Article } from '@/components/ArticleForm';
import { format } from 'date-fns';

// --- Mock Data Storage (using localStorage for persistence) ---
// Tasks are now handled by Supabase, so no getTasks/saveTasks here.

const getArticles = (): Article[] => {
  const storedArticles = localStorage.getItem('mockArticles');
  return storedArticles ? JSON.parse(storedArticles) : [];
};

const saveArticles = (articles: Article[]) => {
  localStorage.setItem('mockArticles', JSON.stringify(articles));
};

// --- Initial Data (if localStorage is empty) ---
// Initial tasks are now handled by Supabase.

let articles: Article[] = getArticles();
if (articles.length === 0) {
  articles = [
    { id: 'kb-1', title: 'Como configurar a impressora de rede?', content: '1. Abra o Painel de Controlo...\n2. Vá em "Dispositivos e Impressoras"...\n3. Clique em "Adicionar uma impressora"...', category: 'Hardware' },
    { id: 'kb-2', title: 'Como aceder à VPN da empresa?', content: 'Abra o cliente Cisco AnyConnect...\nDigite o endereço vpn.suaempresa.com.pt...', category: 'Rede' },
    { id: 'kb-3', title: 'O que fazer quando um software bloqueia?', content: 'Primeiro, tente fechar o programa pelo Gestor de Tarefas (Ctrl+Shift+Esc).', category: 'Software' },
    { id: 'kb-4', title: 'Guia de Segurança de Palavras-passe', content: 'Use palavras-passe fortes e únicas. Não partilhe as suas palavras-passe.', category: 'Segurança' },
    { id: 'kb-5', title: 'Resolução de Problemas de Ecrã Tátil HyFlex', content: 'Verifique as conexões de vídeo e USB. Calibre o ecrã se necessário.', category: 'Hardware' },
    { id: 'kb-6', title: 'Configuração de Email Institucional', content: 'Passos para configurar o email da universidade em diferentes clientes de email.', category: 'Sistemas Internos' },
    { id: 'kb-7', title: 'Utilização do Microsoft Teams para Aulas', content: 'Guia rápido para professores e alunos sobre como usar o Teams para reuniões e partilha de ficheiros.', category: 'Software Académico' },
    { id: 'kb-8', title: 'Boas Práticas de Atendimento ao Aluno', content: 'Dicas para um atendimento eficiente e empático a alunos com problemas técnicos.', category: 'Atendimento Aluno' },
  ];
  saveArticles(articles);
}

// --- Task API (Removed - now in supabaseTasks.ts) ---

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

// --- Report Metrics API (Removed - now in supabaseReports.ts) ---

// --- Notification API (for floating menu) ---
export interface AppNotification {
  id: string;
  message: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  link?: string; // Optional link for navigation
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
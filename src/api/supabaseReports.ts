import { apiGetTasks, apiGetTrashedTasks } from './mockTasks'; // Agora importado de mockTasks
import { apiGetArticles } from './mockApi'; // Articles still from mock
// import { supabase } from '@/integrations/supabase/client'; // Removido o import do supabase
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle, Trash2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

export const apiGetReportMetrics = async () => {
  // Usando as APIs mock de tarefas e artigos
  const allTasks = await apiGetTasks();
  const trashedTasks = await apiGetTrashedTasks();
  const articles = apiGetArticles();

  const tasksConcludedToday = allTasks.filter(task => 
    task.status === 'concluido' && task.completedAt && 
    format(task.completedAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;
  const openTasks = allTasks.filter(task => task.status !== 'concluido' && task.status !== 'lixeira').length;
  const escalatedTasks = allTasks.filter(task => task.priority === 'Alta' && task.status !== 'concluido' && task.status !== 'lixeira').length; // Exemplo de escalado
  const articlesAddedThisMonth = articles.filter(article => {
    // Assumindo que articles não têm createdAt, ou adicionando um mock para isso
    // Por enquanto, apenas o total de artigos
    return true; 
  }).length;
  const trashedTasksCount = trashedTasks.length;
  const avgResolutionTimeMinutes = 45; // Mocked

  return [
    { title: 'Tickets Resolvidos (Hoje)', value: tasksConcludedToday.toString(), change: '+2', icon: CheckCircle },
    { title: 'Tickets Abertos', value: openTasks.toString(), change: '-1', icon: GitBranch },
    { title: 'Tickets Escalados', value: escalatedTasks.toString(), change: '+1', icon: AlertTriangle },
    { title: 'Artigos KB Adicionados', value: articlesAddedThisMonth.toString(), change: '+2', icon: BookOpen },
    { title: 'Tempo Médio de Resolução', value: `${avgResolutionTimeMinutes} min`, change: '-5 min', icon: XCircle },
    { title: 'Tarefas na Lixeira', value: trashedTasksCount.toString(), change: '0', icon: Trash2 },
  ];
};

// Mock data for audit log (kept as is)
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  user: string;
}

export const apiGetAuditLog = (): AuditLogEntry[] => {
  // This would ideally come from a Supabase table
  return [
    { id: 'audit-1', timestamp: new Date(Date.now() - 3600000 * 24 * 5), action: 'Tarefa criada', details: 'Título: "Verificar backup do servidor"', user: 'Técnico A' },
    { id: 'audit-2', timestamp: new Date(Date.now() - 3600000 * 24 * 4), action: 'Tarefa atualizada', details: 'Status de "novo" para "emAndamento" (ID: task-1)', user: 'Técnico A' },
    { id: 'audit-3', timestamp: new Date(Date.now() - 3600000 * 24 * 3), action: 'Artigo KB adicionado', details: 'Título: "Como configurar a impressora de rede?"', user: 'Admin' },
    { id: 'audit-4', timestamp: new Date(Date.now() - 3600000 * 24 * 2), action: 'Tarefa movida para lixeira', details: 'Título: "Trocar toner da impressora" (ID: task-3)', user: 'Técnico B' },
    { id: 'audit-5', timestamp: new Date(Date.now() - 3600000 * 12), action: 'Tarefa restaurada', details: 'Título: "Trocar toner da impressora" (ID: task-3)', user: 'Técnico B' },
    { id: 'audit-6', timestamp: new Date(Date.now() - 3600000 * 6), action: 'Tarefa concluída', details: 'Título: "Verificar backup do servidor" (ID: task-1)', user: 'Técnico A' },
    { id: 'audit-7', timestamp: new Date(Date.now() - 3600000 * 3), action: 'Login', details: 'Utilizador: Técnico A', user: 'Técnico A' },
    { id: 'audit-8', timestamp: new Date(Date.now() - 3600000 * 1), action: 'Configurações atualizadas', details: 'Tema alterado para "dark"', user: 'Técnico A' },
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Mock data for the chart (Last 7 days)
export const apiGetResolutionChartData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      name: format(date, 'EEE'), // e.g., Seg, Ter
      resolved: Math.floor(Math.random() * 10) + 5,
      open: Math.floor(Math.random() * 8) + 2,
    });
  }
  return data;
};
import { apiGetTasks, apiGetTrashedTasks } from './supabaseTasks'; // Removido .ts
import { apiGetArticles } from './mockApi'; // Articles still from mock
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle, Trash2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

export const apiGetReportMetrics = async () => {
  // Since we don't have RLS policies on tasks for SELECT TO anonymous, 
  // we need to ensure this function is called with a user ID or handle the case where it's called without one (e.g., mock data if no user).
  // For now, we rely on the calling component (ReportsPage) to handle the user context, but the metrics themselves are mostly aggregated.
  
  // Mocking task counts for metrics:
  const tasksConcludedToday = 5;
  const openTasks = 23;
  const escalatedTasks = 4;
  const articlesAddedThisMonth = apiGetArticles().length; // Now correctly imported
  const trashedTasksCount = 7; // Mocked
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
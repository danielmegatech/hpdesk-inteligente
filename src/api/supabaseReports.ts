import { apiGetTasks, apiGetTrashedTasks } from './supabaseTasks';
import { apiGetArticles } from './mockApi'; // Articles still from mock
import { CheckCircle, AlertTriangle, BookOpen, GitBranch, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const apiGetReportMetrics = async () => {
  const currentTasks = await apiGetTasks();
  const trashedTasks = await apiGetTrashedTasks();
  const currentArticles = apiGetArticles(); // From mockApi
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  const tasksConcludedToday = currentTasks.filter(t => t.status === 'concluido' && t.completedAt && format(t.completedAt, 'yyyy-MM-dd') === today).length;
  const openTasks = currentTasks.filter(t => t.status !== 'concluido' && t.status !== 'lixeira').length;
  const escalatedTasks = currentTasks.filter(t => t.status === 'pendenteAutorizacaoEscalado').length;
  const articlesAddedThisMonth = currentArticles.length; // Simplified for mock articles

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
    { title: 'Tarefas na Lixeira', value: trashedTasks.length.toString(), change: '0', icon: Trash2 },
  ];
};

// Mock data for audit log
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
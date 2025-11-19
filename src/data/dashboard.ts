import { Ticket, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const dashboardMetrics = [
  {
    id: 'open_tickets',
    title: 'Tickets Abertos',
    value: 12,
    description: 'Aguardando atendimento',
    icon: Ticket,
    color: 'text-blue-500',
  },
  {
    id: 'in_progress',
    title: 'Em Progresso',
    value: 8,
    description: 'Sendo resolvidos',
    icon: Clock,
    color: 'text-yellow-500',
  },
  {
    id: 'resolved_today',
    title: 'Resolvidos Hoje',
    value: 24,
    description: 'Concluídos com sucesso',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    id: 'urgent_tickets',
    title: 'Urgentes',
    value: 3,
    description: 'Requerem atenção imediata',
    icon: AlertTriangle,
    color: 'text-red-500',
  },
];

export const recentTickets = [
  {
    id: '#1234',
    title: 'Problema de acesso ao WiFi',
    requester: 'João Silva',
    priority: 'Alta',
    status: 'Aberto',
  },
  {
    id: '#1233',
    title: 'Resetar palavra-passe',
    requester: 'Maria Santos',
    priority: 'Média',
    status: 'Em Progresso',
  },
  {
    id: '#1232',
    title: 'Instalação de software',
    requester: 'Pedro Costa',
    priority: 'Baixa',
    status: 'Aberto',
  },
];
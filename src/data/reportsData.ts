import { Cpu, Wifi, AppWindow, AlertTriangle, CheckCircle, XCircle, GitBranch, BookOpen, Clock, User, FileText, Settings } from 'lucide-react';

// --- Possibility Tree Data ---
export interface PossibilityNode {
  id: string;
  text: string;
  type: 'path_taken' | 'alternative' | 'resolution';
  icon: React.ElementType;
  children?: PossibilityNode[];
}

export const possibilityTreeData: PossibilityNode = {
  id: 'root',
  text: 'Utilizador relata lentidão na rede',
  type: 'path_taken',
  icon: Wifi,
  children: [
    {
      id: 'check_cable',
      text: 'Verificar cabo de rede',
      type: 'path_taken',
      icon: Wifi,
      children: [
        {
          id: 'cable_ok',
          text: 'Cabo OK, luzes a piscar',
          type: 'path_taken',
          icon: CheckCircle,
          children: [
            {
              id: 'ping_test',
              text: 'Teste de Ping para gateway',
              type: 'path_taken',
              icon: Cpu,
              children: [
                 {
                  id: 'ping_fail',
                  text: 'Ping falhou',
                  type: 'path_taken',
                  icon: XCircle,
                   children: [
                    { id: 'ticket_network_point', text: 'RESOLUÇÃO: Abrir pedido de suporte para verificar ponto de rede.', type: 'resolution', icon: AlertTriangle }
                  ]
                },
                {
                  id: 'ping_ok',
                  text: 'Ping OK',
                  type: 'alternative',
                  icon: CheckCircle,
                  children: [
                    { id: 'check_dns', text: 'Verificar configurações de DNS', type: 'alternative', icon: Cpu },
                    { id: 'check_proxy', text: 'Verificar configurações de Proxy', type: 'alternative', icon: AppWindow },
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'cable_bad',
          text: 'Cabo desligado ou sem luz',
          type: 'alternative',
          icon: XCircle,
          children: [
            { id: 'instruct_reconnect', text: 'Instruir utilizador a reconectar', type: 'alternative', icon: Wifi },
          ]
        }
      ]
    },
    {
      id: 'check_massive',
      text: 'Verificar se é problema massivo',
      type: 'alternative',
      icon: AlertTriangle,
      children: [
        { id: 'check_monitoring', text: 'Consultar sistema de monitorização', type: 'alternative', icon: AppWindow },
      ]
    }
  ]
};

// --- New: Completed Service Flow Data (for auditing past services) ---
export const completedServiceFlowData: PossibilityNode = {
  id: 'completed_root',
  text: 'Atendimento: PC não liga',
  type: 'path_taken',
  icon: Cpu,
  children: [
    {
      id: 'completed_power_cable',
      text: 'Cabo de alimentação ligado?',
      type: 'path_taken',
      icon: CheckCircle,
      children: [
        {
          id: 'completed_power_cable_yes',
          text: 'Sim',
          type: 'path_taken',
          icon: CheckCircle,
          children: [
            {
              id: 'completed_psu_noise',
              text: 'Fonte de alimentação faz ruído?',
              type: 'path_taken',
              icon: AlertTriangle,
              children: [
                {
                  id: 'completed_psu_noise_yes',
                  text: 'Sim (cheiro a queimado)',
                  type: 'path_taken',
                  icon: XCircle,
                  children: [
                    { id: 'completed_resolution_psu', text: 'RESOLUÇÃO: Abrir pedido de suporte para troca de fonte de alimentação.', type: 'resolution', icon: Settings }
                  ]
                },
                {
                  id: 'completed_psu_noise_no',
                  text: 'Não',
                  type: 'alternative',
                  icon: CheckCircle,
                  children: [
                    { id: 'completed_resolution_diag', text: 'RESOLUÇÃO: Abrir pedido de suporte para diagnóstico de hardware.', type: 'resolution', icon: Settings }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'completed_power_cable_no',
          text: 'Não',
          type: 'alternative',
          icon: XCircle,
          children: [
            { id: 'completed_resolution_connect', text: 'RESOLUÇÃO: Instruir utilizador a ligar o cabo.', type: 'resolution', icon: CheckCircle }
          ]
        }
      ]
    }
  ]
};

// --- Audit Log Data (Mock) ---
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  user: string;
}

export const auditLogData: AuditLogEntry[] = [
  { id: 'audit-1', timestamp: new Date(Date.now() - 3600000 * 24 * 5), action: 'Tarefa criada', details: 'Título: "Verificar backup do servidor"', user: 'Técnico A' },
  { id: 'audit-2', timestamp: new Date(Date.now() - 3600000 * 24 * 4), action: 'Tarefa atualizada', details: 'Status de "novo" para "emAndamento" (ID: task-1)', user: 'Técnico A' },
  { id: 'audit-3', timestamp: new Date(Date.now() - 3600000 * 24 * 3), action: 'Artigo KB adicionado', details: 'Título: "Como configurar a impressora de rede?"', user: 'Admin' },
  { id: 'audit-4', timestamp: new Date(Date.now() - 3600000 * 24 * 2), action: 'Tarefa movida para lixeira', details: 'Título: "Trocar toner da impressora" (ID: task-3)', user: 'Técnico B' },
  { id: 'audit-5', timestamp: new Date(Date.now() - 3600000 * 12), action: 'Tarefa restaurada', details: 'Título: "Trocar toner da impressora" (ID: task-3)', user: 'Técnico B' },
  { id: 'audit-6', timestamp: new Date(Date.now() - 3600000 * 6), action: 'Tarefa concluída', details: 'Título: "Verificar backup do servidor" (ID: task-1)', user: 'Técnico A' },
  { id: 'audit-7', timestamp: new Date(Date.now() - 3600000 * 3), action: 'Login', details: 'Utilizador: Técnico A', user: 'Técnico A' },
  { id: 'audit-8', timestamp: new Date(Date.now() - 3600000 * 1), action: 'Configurações atualizadas', details: 'Tema alterado para "dark"', user: 'Técnico A' },
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
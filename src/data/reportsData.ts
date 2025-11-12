import { Cpu, Wifi, AppWindow, AlertTriangle, CheckCircle, XCircle, GitBranch } from 'lucide-react';

// --- Sample Report Metrics ---
export const reportMetrics = [
  { title: 'Tickets Resolvidos (Hoje)', value: '14', change: '+2', icon: CheckCircle },
  { title: 'Tempo Médio de Resolução', value: '45 min', change: '-5 min', icon: XCircle },
  { title: 'Tickets por Categoria (Top 3)', value: 'Rede, Password, Computador', icon: GitBranch },
  { title: 'Satisfação do Usuário', value: '92%', change: '+1%', icon: CheckCircle },
];


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
  text: 'Usuário relata lentidão na rede',
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
          text: 'Cabo OK, luzes piscando',
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
                    { id: 'ticket_network_point', text: 'RESOLUÇÃO: Abrir ticket para verificar ponto de rede.', type: 'resolution', icon: AlertTriangle }
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
          text: 'Cabo desconectado ou sem luz',
          type: 'alternative',
          icon: XCircle,
          children: [
            { id: 'instruct_reconnect', text: 'Instruir usuário a reconectar', type: 'alternative', icon: Wifi },
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
        { id: 'check_monitoring', text: 'Consultar sistema de monitoramento', type: 'alternative', icon: AppWindow },
      ]
    }
  ]
};
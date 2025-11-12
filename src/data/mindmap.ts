import { Cpu, Wifi, AppWindow, KeyRound, UserCheck, CalendarPlus, AlertTriangle, MoreHorizontal } from 'lucide-react';

export interface MindmapNode {
  id: string;
  question: string;
  options: {
    text: string;
    nextNodeId: string | null;
  }[];
}

export const categories = [
  { id: 'computer', name: 'Computador', icon: Cpu, startNodeId: 'computer_start' },
  { id: 'network', name: 'Rede', icon: Wifi, startNodeId: 'network_start' },
  { id: 'apps', name: 'Aplicações', icon: AppWindow, startNodeId: 'apps_start' },
  { id: 'password', name: 'Password', icon: KeyRound, startNodeId: 'password_start' },
  { id: 'presential', name: 'Atendimento Presencial', icon: UserCheck, startNodeId: 'presential_start' },
  { id: 'event', name: 'Agendar Evento', icon: CalendarPlus, startNodeId: 'event_start' },
  { id: 'massive', name: 'Problema Massivo', icon: AlertTriangle, startNodeId: 'massive_start' },
  { id: 'others', name: 'Outros', icon: MoreHorizontal, startNodeId: 'others_start' },
];

export const mindmapData: Record<string, MindmapNode> = {
  // --- Computer Flow ---
  'computer_start': {
    id: 'computer_start',
    question: 'O computador liga?',
    options: [
      { text: 'Sim', nextNodeId: 'computer_screen_works' },
      { text: 'Não', nextNodeId: 'computer_power_issue' },
    ],
  },
  'computer_power_issue': {
    id: 'computer_power_issue',
    question: 'O cabo de força está conectado corretamente?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_power_supply' },
      { text: 'Não', nextNodeId: 'end_instruct_connect_cable' },
    ],
  },
  'computer_screen_works': {
    id: 'computer_screen_works',
    question: 'A tela exibe a área de trabalho?',
    options: [
      { text: 'Sim', nextNodeId: 'end_success' },
      { text: 'Não', nextNodeId: 'end_ticket_video_issue' },
    ],
  },

  // --- Network Flow ---
  'network_start': {
    id: 'network_start',
    question: 'O usuário não consegue acessar a internet?',
    options: [
      { text: 'Sim, em nenhum site', nextNodeId: 'network_check_cable' },
      { text: 'Apenas em um sistema específico', nextNodeId: 'apps_start' },
    ],
  },
   'network_check_cable': {
    id: 'network_check_cable',
    question: 'O cabo de rede está conectado e com a luz piscando?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_network_point' },
      { text: 'Não', nextNodeId: 'end_instruct_connect_cable' },
    ],
  },

  // --- Other Placeholder Flows ---
  'apps_start': { id: 'apps_start', question: 'Qual aplicação está com problema?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },
  'password_start': { id: 'password_start', question: 'O usuário precisa de um reset de senha?', options: [{ text: 'Sim', nextNodeId: 'end_ticket_password' }, { text: 'Não', nextNodeId: 'end_ticket' }] },
  'presential_start': { id: 'presential_start', question: 'Agendar atendimento presencial para qual localidade e horário?', options: [{ text: 'Agendar e Criar Ticket', nextNodeId: 'end_ticket' }] },
  'event_start': { id: 'event_start', question: 'Qual equipamento precisa ser preparado para o evento?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },
  'massive_start': { id: 'massive_start', question: 'Qual sistema ou serviço está fora do ar? Descreva o impacto.', options: [{ text: 'Criar Alerta Geral', nextNodeId: 'end_ticket_massive' }] },
  'others_start': { id: 'others_start', question: 'Por favor, descreva o problema em detalhes.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- End Nodes ---
  'end_success': { id: 'end_success', question: 'Problema resolvido com sucesso!', options: [] },
  'end_ticket': { id: 'end_ticket', question: 'Ticket de suporte criado. A equipe técnica entrará em contato.', options: [] },
  'end_ticket_password': { id: 'end_ticket_password', question: 'Ticket para reset de senha criado.', options: [] },
  'end_ticket_power_supply': { id: 'end_ticket_power_supply', question: 'Ticket criado para verificação da fonte de alimentação.', options: [] },
  'end_ticket_video_issue': { id: 'end_ticket_video_issue', question: 'Ticket criado para problema de vídeo.', options: [] },
  'end_ticket_network_point': { id: 'end_ticket_network_point', question: 'Ticket criado para verificar ponto de rede e configurações.', options: [] },
  'end_ticket_massive': { id: 'end_ticket_massive', question: 'Alerta de problema massivo criado e enviado aos responsáveis.', options: [] },
  'end_instruct_connect_cable': { id: 'end_instruct_connect_cable', question: 'Instrua o usuário a conectar o cabo firmemente. Se não resolver, crie um ticket.', options: [{ text: 'Problema Persiste, Criar Ticket', nextNodeId: 'end_ticket' }] },
};
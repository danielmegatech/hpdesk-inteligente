export interface MindmapNode {
  id: string;
  question: string;
  options: {
    text: string;
    nextNodeId: string | null;
  }[];
}

export const mindmapData: Record<string, MindmapNode> = {
  'start': {
    id: 'start',
    question: 'O computador liga?',
    options: [
      { text: 'Sim', nextNodeId: 'screen_works' },
      { text: 'Não', nextNodeId: 'power_issue' },
    ],
  },
  'power_issue': {
    id: 'power_issue',
    question: 'O cabo de força está conectado corretamente na tomada e no computador?',
    options: [
      { text: 'Sim', nextNodeId: 'internal_power_issue' },
      { text: 'Não', nextNodeId: 'connect_power_cable' },
    ],
  },
  'connect_power_cable': {
    id: 'connect_power_cable',
    question: 'Por favor, conecte o cabo de força. O problema foi resolvido?',
    options: [
      { text: 'Sim', nextNodeId: 'end_success' },
      { text: 'Não', nextNodeId: 'internal_power_issue' },
    ],
  },
  'internal_power_issue': {
    id: 'internal_power_issue',
    question: 'Parece ser um problema na fonte de alimentação. É necessário encaminhar para o suporte técnico.',
    options: [
      { text: 'Criar Ticket', nextNodeId: 'end_ticket' },
    ],
  },
  'screen_works': {
    id: 'screen_works',
    question: 'A tela exibe a área de trabalho ou uma tela de login?',
    options: [
      { text: 'Sim', nextNodeId: 'login_issue' },
      { text: 'Não', nextNodeId: 'video_issue' },
    ],
  },
  'video_issue': {
    id: 'video_issue',
    question: 'Verifique se o cabo de vídeo está bem conectado no monitor e no computador. Resolveu?',
     options: [
      { text: 'Sim', nextNodeId: 'end_success' },
      { text: 'Não', nextNodeId: 'end_ticket' },
    ],
  },
  'login_issue': {
    id: 'login_issue',
    question: 'O usuário consegue fazer login?',
    options: [
      { text: 'Sim', nextNodeId: 'end_success' },
      { text: 'Não', nextNodeId: 'password_reset' },
    ],
  },
  'password_reset': {
    id: 'password_reset',
    question: 'O usuário esqueceu a senha?',
    options: [
        { text: 'Sim', nextNodeId: 'end_ticket_password' },
        { text: 'Não', nextNodeId: 'end_ticket' },
    ]
  },
  'end_success': {
    id: 'end_success',
    question: 'Problema resolvido com sucesso!',
    options: [],
  },
  'end_ticket': {
    id: 'end_ticket',
    question: 'Ticket de suporte criado. A equipe técnica entrará em contato.',
    options: [],
  },
  'end_ticket_password': {
    id: 'end_ticket_password',
    question: 'Ticket para reset de senha criado.',
    options: [],
  }
};

export const START_NODE_ID = 'start';
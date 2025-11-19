import { Cpu, Wifi, AppWindow, KeyRound, UserCheck, CalendarPlus, AlertTriangle, MoreHorizontal, HardDrive, Monitor, Speaker, Wrench, Cable, Router, Server, Database, Shield, Lock, Printer, Camera, BatteryCharging, Lightbulb, Handshake, FileText, FlaskConical, GraduationCap, Book, Briefcase, School, CreditCard, CalendarDays, Video, Users, LayoutDashboard } from 'lucide-react';

export interface MindmapNode {
  id: string;
  question: string;
  options: {
    text: string;
    nextNodeId: string | null;
  }[];
}

export const categories = [
  { id: 'hardware_montagem', name: 'Hardware e Montagem', icon: Cpu, startNodeId: 'hardware_start' },
  { id: 'redes_conectividade', name: 'Redes e Conectividade', icon: Wifi, startNodeId: 'redes_start' },
  { id: 'sistemas_software', name: 'Sistemas Operacionais e Software', icon: AppWindow, startNodeId: 'sistemas_start' },
  { id: 'seguranca_governanca', name: 'Segurança e Governança', icon: Shield, startNodeId: 'seguranca_start' },
  { id: 'perifericos_dispositivos', name: 'Periféricos e Dispositivos', icon: Printer, startNodeId: 'perifericos_start' },
  { id: 'energia_infraestrutura', name: 'Energia e Infraestrutura', icon: BatteryCharging, startNodeId: 'energia_start' },
  { id: 'suporte_boas_praticas', name: 'Suporte Técnico e Boas Práticas', icon: Handshake, startNodeId: 'suporte_start' },
  { id: 'manutencao_avancada', name: 'Manutenção Avançada', icon: FlaskConical, startNodeId: 'manutencao_avancada_start' },
  { id: 'atendimento_aluno', name: 'Atendimento a Alunos', icon: GraduationCap, startNodeId: 'aluno_start' },
  { id: 'atendimento_professor', name: 'Atendimento a Professores', icon: Book, startNodeId: 'professor_start' },
  { id: 'atendimento_staff', name: 'Atendimento a Staff', icon: Briefcase, startNodeId: 'staff_start' },
  { id: 'software_academico', name: 'Software Académico', icon: School, startNodeId: 'software_academico_start' },
  { id: 'fluxos_atendimento', name: 'Fluxos de Atendimento', icon: LayoutDashboard, startNodeId: 'fluxos_atendimento_start' },
  { id: 'others', name: 'Outros', icon: MoreHorizontal, startNodeId: 'others_start' },
];

export const mindmapData: Record<string, MindmapNode> = {
  // --- Hardware e Montagem Flow ---
  'hardware_start': {
    id: 'hardware_start',
    question: 'Qual o problema de hardware?',
    options: [
      { text: 'PC não liga', nextNodeId: 'pc_nao_liga_start' },
      { text: 'PC liga mas não dá ecrã', nextNodeId: 'pc_liga_nao_da_ecra_start' },
      { text: 'Impressora/Toner', nextNodeId: 'impressora_toner_start' },
      { text: 'Outro', nextNodeId: 'hardware_outros' },
    ],
  },
  'pc_nao_liga_start': {
    id: 'pc_nao_liga_start',
    question: 'O cabo de alimentação está ligado corretamente à tomada e ao PC?',
    options: [
      { text: 'Sim', nextNodeId: 'pc_nao_liga_fonte_barulho' },
      { text: 'Não', nextNodeId: 'end_instruct_connect_cable' },
    ],
  },
  'pc_nao_liga_fonte_barulho': {
    id: 'pc_nao_liga_fonte_barulho',
    question: 'A fonte de alimentação faz algum ruído ou cheiro a queimado?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_fonte_problema' },
      { text: 'Não', nextNodeId: 'end_ticket_diagnostico_hardware' },
    ],
  },
  'pc_liga_nao_da_ecra_start': {
    id: 'pc_liga_nao_da_ecra_start',
    question: 'O monitor está ligado e conectado ao PC?',
    options: [
      { text: 'Sim', nextNodeId: 'pc_liga_nao_da_ecra_cabo_video' },
      { text: 'Não', nextNodeId: 'end_instruct_ligar_monitor' },
    ],
  },
  'pc_liga_nao_da_ecra_cabo_video': {
    id: 'pc_liga_nao_da_ecra_cabo_video',
    question: 'O cabo de vídeo está firmemente conectado em ambas as pontas?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_diagnostico_video' },
      { text: 'Não', nextNodeId: 'end_instruct_conectar_cabo_video' },
    ],
  },
  'impressora_toner_start': {
    id: 'impressora_toner_start',
    question: 'Qual o problema com a impressora ou toner?',
    options: [
      { text: 'Impressora não imprime', nextNodeId: 'impressora_nao_imprime' },
      { text: 'Trocar toner/cartucho', nextNodeId: 'impressora_trocar_toner' },
      { text: 'Outro', nextNodeId: 'end_ticket_impressora' },
    ],
  },
  'impressora_nao_imprime': {
    id: 'impressora_nao_imprime',
    question: 'A impressora está ligada e conectada à rede/PC?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_impressora_diagnostico' },
      { text: 'Não', nextNodeId: 'end_instruct_ligar_impressora' },
    ],
  },
  'impressora_trocar_toner': {
    id: 'impressora_trocar_toner',
    question: 'O toner/cartucho está disponível para troca?',
    options: [
      { text: 'Sim', nextNodeId: 'end_instruct_trocar_toner' },
      { text: 'Não', nextNodeId: 'end_ticket_solicitar_toner' },
    ],
  },
  'hardware_outros': { id: 'hardware_outros', question: 'Por favor, descreva o problema de hardware.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Redes e Conectividade Flow ---
  'redes_start': {
    id: 'redes_start',
    question: 'Qual o problema de rede?',
    options: [
      { text: 'Não acede à internet/rede', nextNodeId: 'network_check_cable' },
      { text: 'Problema com Wi-Fi', nextNodeId: 'wifi_problema_start' },
      { text: 'Problema com VPN/Firewall', nextNodeId: 'vpn_firewall_start' },
      { text: 'Outro', nextNodeId: 'redes_outros' },
    ],
  },
  'network_check_cable': {
    id: 'network_check_cable',
    question: 'O cabo de rede está conectado e com a luz a piscar?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_network_point' },
      { text: 'Não', nextNodeId: 'end_instruct_connect_cable' },
    ],
  },
  'wifi_problema_start': {
    id: 'wifi_problema_start',
    question: 'O problema é com a rede Wi-Fi da universidade (Eduroam/U-Porto)?',
    options: [
      { text: 'Não consigo ligar', nextNodeId: 'wifi_nao_liga' },
      { text: 'Conexão instável', nextNodeId: 'wifi_instavel' },
      { text: 'Outro', nextNodeId: 'end_ticket_config_wifi' },
    ],
  },
  'wifi_nao_liga': { id: 'wifi_nao_liga', question: 'Já tentou reiniciar o dispositivo e esquecer/reconectar a rede?', options: [{ text: 'Sim', nextNodeId: 'end_ticket_config_wifi' }, { text: 'Não', nextNodeId: 'end_instruct_wifi_reset' }] },
  'wifi_instavel': { id: 'wifi_instavel', question: 'O problema ocorre em todas as áreas da universidade ou apenas em um local específico?', options: [{ text: 'Local específico', nextNodeId: 'end_ticket_network_point' }, { text: 'Todas as áreas', nextNodeId: 'end_ticket_config_wifi' }] },
  'vpn_firewall_start': {
    id: 'vpn_firewall_start',
    question: 'O problema é com acesso à VPN ou bloqueio de firewall?',
    options: [
      { text: 'VPN não conecta', nextNodeId: 'end_ticket_vpn' },
      { text: 'Site/serviço bloqueado', nextNodeId: 'end_ticket_firewall' },
    ],
  },
  'redes_outros': { id: 'redes_outros', question: 'Por favor, descreva o problema de rede.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Sistemas Operacionais e Software Flow ---
  'sistemas_start': {
    id: 'sistemas_start',
    question: 'Qual o problema com sistema operativo ou software?',
    options: [
      { text: 'PC lento/otimização', nextNodeId: 'otimizacao_windows_start' },
      { text: 'Instalação/formatação', nextNodeId: 'instalacao_formatacao_start' },
      { text: 'Bugs específicos (Office 365, Teams, Zoom)', nextNodeId: 'bugs_software_universitario_start' },
      { text: 'Outro', nextNodeId: 'sistemas_outros' },
    ],
  },
  'otimizacao_windows_start': {
    id: 'otimizacao_windows_start',
    question: 'Já tentou reiniciar o PC e limpar ficheiros temporários?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_otimizacao_avancada' },
      { text: 'Não', nextNodeId: 'end_instruct_otimizacao_basica' },
    ],
  },
  'instalacao_formatacao_start': {
    id: 'instalacao_formatacao_start',
    question: 'Precisa formatar o Windows ou instalar um programa específico?',
    options: [
      { text: 'Formatar Windows', nextNodeId: 'end_ticket_formatacao' },
      { text: 'Instalar programa', nextNodeId: 'end_ticket_instalacao_software' },
    ],
  },
  'bugs_software_universitario_start': {
    id: 'bugs_software_universitario_start',
    question: 'Qual software está a apresentar o bug?',
    options: [
      { text: 'Office 365 (Word, Excel, PowerPoint)', nextNodeId: 'end_ticket_bug_office' },
      { text: 'Microsoft Teams', nextNodeId: 'end_ticket_bug_teams' },
      { text: 'Zoom', nextNodeId: 'end_ticket_bug_zoom' },
      { text: 'Outro', nextNodeId: 'end_ticket_bug_software' },
    ],
  },
  'sistemas_outros': { id: 'sistemas_outros', question: 'Por favor, descreva o problema de sistema/software.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Segurança e Governança Flow ---
  'seguranca_start': {
    id: 'seguranca_start',
    question: 'Qual o tópico de segurança?',
    options: [
      { text: 'Perda/Reset de Senha', nextNodeId: 'perda_senha_start' },
      { text: 'LGPD/Segurança da Informação', nextNodeId: 'lgpd_si_start' },
      { text: 'Ransomware/Proteção', nextNodeId: 'ransomware_start' },
      { text: 'Outro', nextNodeId: 'seguranca_outros' },
    ],
  },
  'perda_senha_start': {
    id: 'perda_senha_start',
    question: 'A senha é do email institucional, portal académico ou outro serviço?',
    options: [
      { text: 'Email/Portal Académico', nextNodeId: 'end_instruct_reset_senha_portal' },
      { text: 'Outro serviço', nextNodeId: 'end_ticket_reset_senha_geral' },
    ],
  },
  'lgpd_si_start': { id: 'lgpd_si_start', question: 'Qual a dúvida sobre LGPD/Segurança da Informação?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_lgpd' }] },
  'ransomware_start': { id: 'ransomware_start', question: 'Suspeita de ataque de ransomware ou precisa de proteção?', options: [{ text: 'Criar Alerta de Segurança', nextNodeId: 'end_ticket_ransomware' }] },
  'seguranca_outros': { id: 'seguranca_outros', question: 'Por favor, descreva o tópico de segurança.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Periféricos e Dispositivos Flow ---
  'perifericos_start': {
    id: 'perifericos_start',
    question: 'Qual o problema com periféricos/dispositivos?',
    options: [
      { text: 'Ecrãs Táteis HyFlex', nextNodeId: 'ecras_tateis_hyflex_start' },
      { text: 'Webcams', nextNodeId: 'webcams_start' },
      { text: 'Monitor/Projetor', nextNodeId: 'monitor_projetor_start' },
      { text: 'Outro', nextNodeId: 'perifericos_outros' },
    ],
  },
  'ecras_tateis_hyflex_start': {
    id: 'ecras_tateis_hyflex_start',
    question: 'O ecrã tátil não responde ou não exibe imagem?',
    options: [
      { text: 'Não responde ao toque', nextNodeId: 'end_ticket_ecra_tatil_toque' },
      { text: 'Não exibe imagem', nextNodeId: 'end_ticket_ecra_tatil_imagem' },
      { text: 'Dúvida de utilização', nextNodeId: 'end_kb_hyflex_guide' },
    ],
  },
  'webcams_start': {
    id: 'webcams_start',
    question: 'A webcam não funciona ou a imagem está com problemas?',
    options: [
      { text: 'Não funciona', nextNodeId: 'end_ticket_webcam_nao_funciona' },
      { text: 'Problema de imagem/áudio', nextNodeId: 'end_ticket_webcam_problema_imagem' },
    ],
  },
  'monitor_projetor_start': { id: 'monitor_projetor_start', question: 'Qual o problema com monitor ou projetor?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_periferico' }] },
  'perifericos_outros': { id: 'perifericos_outros', question: 'Por favor, descreva o problema com periféricos.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Energia e Infraestrutura Flow ---
  'energia_start': {
    id: 'energia_start',
    question: 'Qual o problema de energia/infraestrutura?',
    options: [
      { text: 'Estabilizador/Nobreak', nextNodeId: 'estabilizador_nobreak_start' },
      { text: 'Tomada/Fiação Elétrica', nextNodeId: 'tomada_fiacao_start' },
      { text: 'Outro', nextNodeId: 'energia_outros' },
    ],
  },
  'estabilizador_nobreak_start': { id: 'estabilizador_nobreak_start', question: 'Problema com estabilizador ou nobreak?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_energia' }] },
  'tomada_fiacao_start': { id: 'tomada_fiacao_start', question: 'Problema com tomada ou fiação elétrica?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_eletrica' }] },
  'energia_outros': { id: 'energia_outros', question: 'Por favor, descreva o problema de energia.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Suporte Técnico e Boas Práticas Flow ---
  'suporte_start': {
    id: 'suporte_start',
    question: 'Qual o tópico de suporte/boas práticas?',
    options: [
      { text: 'Dúvida sobre atendimento', nextNodeId: 'duvida_atendimento_start' },
      { text: 'Ferramentas indispensáveis', nextNodeId: 'ferramentas_indispensaveis_start' },
      { text: 'Outro', nextNodeId: 'suporte_outros' },
    ],
  },
  'duvida_atendimento_start': { id: 'duvida_atendimento_start', question: 'Qual a dúvida sobre o processo de atendimento?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_suporte' }] },
  'ferramentas_indispensaveis_start': { id: 'ferramentas_indispensaveis_start', question: 'Precisa de informações sobre ferramentas de suporte?', options: [{ text: 'Consultar Base de Conhecimento', nextNodeId: 'end_kb_redirect' }] },
  'suporte_outros': { id: 'suporte_outros', question: 'Por favor, descreva o tópico de suporte.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Manutenção Avançada Flow ---
  'manutencao_avancada_start': {
    id: 'manutencao_avancada_start',
    question: 'Qual o tipo de manutenção avançada?',
    options: [
      { text: 'Limpeza/Troca de Pasta Térmica', nextNodeId: 'limpeza_pasta_termica_start' },
      { text: 'Diagnóstico de Hardware', nextNodeId: 'diagnostico_hardware_avancado_start' },
      { text: 'Eletrónica Básica', nextNodeId: 'eletronica_basica_start' },
      { text: 'Outro', nextNodeId: 'manutencao_avancada_outros' },
    ],
  },
  'limpeza_pasta_termica_start': { id: 'limpeza_pasta_termica_start', question: 'Precisa de guia para limpeza ou troca de pasta térmica?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_manutencao_avancada' }] },
  'diagnostico_hardware_avancado_start': { id: 'diagnostico_hardware_avancado_start', question: 'Precisa de ajuda com diagnóstico avançado de hardware?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_manutencao_avancada' }] },
  'eletronica_basica_start': { id: 'eletronica_basica_start', question: 'Dúvidas sobre eletrónica básica (bateria, jumper)?', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket_manutencao_avancada' }] },
  'manutencao_avancada_outros': { id: 'manutencao_avancada_outros', question: 'Por favor, descreva o tópico de manutenção avançada.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Atendimento a Alunos Flow ---
  'aluno_start': {
    id: 'aluno_start',
    question: 'Qual o problema do aluno?',
    options: [
      { text: 'Perda de Senha (Portal/Email)', nextNodeId: 'aluno_perda_senha_start' },
      { text: 'Problemas com Propinas/Pagamentos', nextNodeId: 'aluno_propinas_start' },
      { text: 'Apoio a Ecrãs Táteis HyFlex/Webcams', nextNodeId: 'ecras_tateis_hyflex_start' },
      { text: 'Problemas com Teams/Zoom', nextNodeId: 'bugs_software_universitario_start' },
      { text: 'Outro', nextNodeId: 'aluno_outros' },
    ],
  },
  'aluno_perda_senha_start': {
    id: 'aluno_perda_senha_start',
    question: 'Qual o domínio do email do aluno? (ex: @campus.pt, @iade.pt)',
    options: [
      { text: '@campus.pt ou @iade.pt', nextNodeId: 'aluno_senha_portal_canvas' },
      { text: 'Outro domínio', nextNodeId: 'end_ticket_reset_senha_geral' },
    ],
  },
  'aluno_senha_portal_canvas': {
    id: 'aluno_senha_portal_canvas',
    question: 'O aluno consegue aceder a password.europeia.pt?',
    options: [
      { text: 'Sim', nextNodeId: 'end_instruct_reset_senha_portal' },
      { text: 'Não', nextNodeId: 'aluno_senha_manual' },
    ],
  },
  'aluno_senha_manual': {
    id: 'aluno_senha_manual',
    question: 'É necessário criar uma nova palavra-passe manualmente?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_reset_senha_manual' },
      { text: 'Não', nextNodeId: 'end_instruct_reset_senha_portal' }, // Re-attempt portal guidance
    ],
  },
  'aluno_propinas_start': {
    id: 'aluno_propinas_start',
    question: 'O aluno não pagou as propinas ou tem dúvidas sobre pagamentos?',
    options: [
      { text: 'Não pagou propinas', nextNodeId: 'aluno_propinas_sistema112' },
      { text: 'Dúvidas sobre pagamentos', nextNodeId: 'end_encaminhar_nucleo_aluno' },
    ],
  },
  'aluno_propinas_sistema112': {
    id: 'aluno_propinas_sistema112',
    question: 'Verificou o estado da propina no Sistema 112?',
    options: [
      { text: 'Sim, está paga', nextNodeId: 'aluno_propinas_acesso_ok' },
      { text: 'Sim, está em dívida', nextNodeId: 'end_encaminhar_secretaria_bloqueado' },
      { text: 'Não verifiquei', nextNodeId: 'end_instruct_verificar_sistema112' },
    ],
  },
  'aluno_propinas_acesso_ok': {
    id: 'aluno_propinas_acesso_ok',
    question: 'Mesmo com propina paga, o aluno não tem acesso? (Encaminhar para password.europeia.pt)',
    options: [
      { text: 'Sim, sem acesso', nextNodeId: 'aluno_senha_portal_canvas' }, // Reutiliza fluxo de senha
      { text: 'Não, acesso OK', nextNodeId: 'end_success' },
    ],
  },
  'aluno_outros': { id: 'aluno_outros', question: 'Por favor, descreva o problema do aluno.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Atendimento a Professores Flow ---
  'professor_start': {
    id: 'professor_start',
    question: 'Qual o problema do professor?',
    options: [
      { text: 'Aulas/Chamadas não aparecem', nextNodeId: 'professor_planeamento_start' },
      { text: 'Problemas com Teams/Zoom', nextNodeId: 'bugs_software_universitario_start' },
      { text: 'Apoio a Ecrãs Táteis HyFlex/Webcams', nextNodeId: 'ecras_tateis_hyflex_start' },
      { text: 'Software Académico (AutoCAD, SPSS, etc.)', nextNodeId: 'software_academico_start' },
      { text: 'Outro', nextNodeId: 'professor_outros' },
    ],
  },
  'professor_planeamento_start': {
    id: 'professor_planeamento_start',
    question: 'As aulas ou chamadas não aparecem no calendário ou plataforma?',
    options: [
      { text: 'Aulas não aparecem', nextNodeId: 'end_ticket_planeamento_aulas' },
      { text: 'Chamadas não aparecem', nextNodeId: 'end_ticket_planeamento_chamadas' },
    ],
  },
  'professor_outros': { id: 'professor_outros', question: 'Por favor, descreva o problema do professor.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Atendimento a Staff Flow ---
  'staff_start': {
    id: 'staff_start',
    question: 'Qual o problema do staff?',
    options: [
      { text: 'Perda de Senha (Email/Sistemas Internos)', nextNodeId: 'staff_perda_senha_start' },
      { text: 'Problemas com Office 365/Teams/Zoom', nextNodeId: 'bugs_software_universitario_start' },
      { text: 'Apoio a Ecrãs Táteis HyFlex/Webcams', nextNodeId: 'ecras_tateis_hyflex_start' },
      { text: 'Outro', nextNodeId: 'staff_outros' },
    ],
  },
  'staff_perda_senha_start': {
    id: 'staff_perda_senha_start',
    question: 'Qual o domínio do email do staff? (ex: @universidadeeuropeia.pt, @ext.universidadeeuropeia.pt)',
    options: [
      { text: '@universidadeeuropeia.pt', nextNodeId: 'staff_senha_portal' },
      { text: '@ext.universidadeeuropeia.pt', nextNodeId: 'staff_senha_externo' },
      { text: 'Outro domínio', nextNodeId: 'end_ticket_reset_senha_geral' },
    ],
  },
  'staff_senha_portal': {
    id: 'staff_senha_portal',
    question: 'O staff consegue aceder a password.europeia.pt?',
    options: [
      { text: 'Sim', nextNodeId: 'end_instruct_reset_senha_portal' },
      { text: 'Não', nextNodeId: 'staff_senha_manual' },
    ],
  },
  'staff_senha_externo': {
    id: 'staff_senha_externo',
    question: 'O problema é com a palavra-passe externa ou de sistemas internos?',
    options: [
      { text: 'Palavra-passe externa', nextNodeId: 'end_ticket_reset_senha_externa' },
      { text: 'Sistemas internos', nextNodeId: 'staff_senha_manual' },
    ],
  },
  'staff_senha_manual': {
    id: 'staff_senha_manual',
    question: 'É necessário criar uma nova palavra-passe manualmente?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_reset_senha_manual' },
      { text: 'Não', nextNodeId: 'end_instruct_reset_senha_portal' }, // Re-attempt portal guidance
    ],
  },
  'staff_outros': { id: 'staff_outros', question: 'Por favor, descreva o problema do staff.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },

  // --- Software Académico Flow ---
  'software_academico_start': {
    id: 'software_academico_start',
    question: 'Qual software académico está com problema?',
    options: [
      { text: 'AutoCAD', nextNodeId: 'end_ticket_software_autocad' },
      { text: 'MAXQDA', nextNodeId: 'end_ticket_software_maxqda' },
      { text: 'IBM SPSS', nextNodeId: 'end_ticket_software_spss' },
      { text: 'Adobe Creative Cloud', nextNodeId: 'end_ticket_software_adobe' },
      { text: 'Outro', nextNodeId: 'end_ticket_software_academico_geral' },
    ],
  },
  
  // --- Fluxos de Atendimento Category ---
  'fluxos_atendimento_start': {
    id: 'fluxos_atendimento_start',
    question: 'Qual fluxo de atendimento você precisa?',
    options: [
      { text: 'Aluno não acede à aula', nextNodeId: 'flow_aluno_nao_aula' },
      { text: 'Esqueceu/Expirou Password', nextNodeId: 'flow_password_reset_start' },
      { text: 'Problemas Login Wi-Fi', nextNodeId: 'flow_wifi_login_problema' },
      { text: 'Problemas Login Email', nextNodeId: 'flow_email_login_problema' },
      { text: 'Problemas ServiceNow', nextNodeId: 'flow_servicenow_problema' },
      { text: 'Problemas HyFlex', nextNodeId: 'flow_hyflex_problema' },
      { text: 'Plataforma Exam.net', nextNodeId: 'flow_examnet_problema' },
      { text: 'MFA Ativado (Alunos)', nextNodeId: 'flow_mfa_aluno' },
      { text: 'Erro 500 Calendário Canvas (Mac)', nextNodeId: 'flow_erro500_canvas_mac' },
      { text: 'Outro Fluxo', nextNodeId: 'end_ticket' },
    ],
  },
  'flow_aluno_nao_aula': {
    id: 'flow_aluno_nao_aula',
    question: 'Aluno não consegue aceder à aula?',
    options: [
      { text: 'Verificar Teams/Canvas', nextNodeId: 'end_instruct_teams_canvas_aula' },
      { text: 'Professor não adicionou aluno', nextNodeId: 'end_encaminhar_professor_gestor' },
    ],
  },
  'flow_password_reset_start': {
    id: 'flow_password_reset_start',
    question: 'A palavra-passe é do email institucional, portal académico ou outro serviço?',
    options: [
      { text: 'Email/Portal Académico/Staff', nextNodeId: 'password_reset_portal_flow' },
      { text: 'Conta bloqueada por tentativas', nextNodeId: 'end_instruct_pwm_desbloquear' },
      { text: 'Outro serviço', nextNodeId: 'end_ticket_reset_senha_geral' },
    ],
  },
  'password_reset_portal_flow': {
    id: 'password_reset_portal_flow',
    question: 'Instrua o utilizador a aceder a password.europeia.pt e seguir os passos de recuperação.',
    options: [
      { text: 'Problema Persiste', nextNodeId: 'end_ticket_reset_senha_manual' },
      { text: 'Resolvido', nextNodeId: 'end_success' },
    ],
  },
  'flow_wifi_login_problema': {
    id: 'flow_wifi_login_problema',
    question: 'Qual o perfil do utilizador com problema de Wi-Fi?',
    options: [
      { text: 'Aluno (UE-Students)', nextNodeId: 'wifi_aluno_flow' },
      { text: 'Docente (UE-Faculty)', nextNodeId: 'wifi_docente_flow' },
      { text: 'Staff (UE-Employees)', nextNodeId: 'wifi_staff_flow' },
      { text: 'Convidado (UE-Events)', nextNodeId: 'wifi_convidado_flow' },
      { text: 'Outro', nextNodeId: 'end_ticket_config_wifi' },
    ],
  },
  'wifi_aluno_flow': {
    id: 'wifi_aluno_flow',
    question: 'Instrua o aluno a conectar à rede UE-Students com credenciais Canvas. Verificar grupo "wifi alunos" no domínio se necessário.',
    options: [
      { text: 'Problema Persiste', nextNodeId: 'end_ticket_config_wifi' },
      { text: 'Resolvido', nextNodeId: 'end_success' },
    ],
  },
  'wifi_docente_flow': {
    id: 'wifi_docente_flow',
    question: 'Instrua o docente a conectar à rede UE-Faculty com credenciais Canvas.',
    options: [
      { text: 'Problema Persiste', nextNodeId: 'end_ticket_config_wifi' },
      { text: 'Resolvido', nextNodeId: 'end_success' },
    ],
  },
  'wifi_staff_flow': {
    id: 'wifi_staff_flow',
    question: 'Instrua o staff a conectar à rede UE-Employees com credenciais do computador.',
    options: [
      { text: 'Problema Persiste', nextNodeId: 'end_ticket_config_wifi' },
      { text: 'Resolvido', nextNodeId: 'end_success' },
    ],
  },
  'wifi_convidado_flow': {
    id: 'wifi_convidado_flow',
    question: 'Instrua o convidado a conectar à rede UE-Events com a palavra-passe: UE-PT-Ev3.2025.',
    options: [
      { text: 'Problema Persiste', nextNodeId: 'end_ticket_config_wifi' },
      { text: 'Resolvido', nextNodeId: 'end_success' },
    ],
  },
  'flow_email_login_problema': {
    id: 'flow_email_login_problema',
    question: 'Problemas para entrar no email?',
    options: [
      { text: 'Verificar 112/PWM/Canvas', nextNodeId: 'end_instruct_email_check' },
      { text: 'Aluno novo (24h integração)', nextNodeId: 'end_encaminhar_servicos_academicos' },
    ],
  },
  'flow_servicenow_problema': {
    id: 'flow_servicenow_problema',
    question: 'Problemas para entrar no ServiceNow?',
    options: [
      { text: 'Verificar erro/link/PWM', nextNodeId: 'end_instruct_servicenow_check' },
      { text: 'Dispositivo diferente (reset SSO)', nextNodeId: 'end_ticket_servicenow_sso_reset' },
    ],
  },
  'flow_hyflex_problema': {
    id: 'flow_hyflex_problema',
    question: 'Qual o problema com HyFlex?',
    options: [
      { text: 'Assistência geral', nextNodeId: 'end_instruct_hyflex_rececao_it' },
      { text: 'SmartMirror', nextNodeId: 'end_instruct_hyflex_smartmirror' },
    ],
  },
  'flow_examnet_problema': {
    id: 'flow_examnet_problema',
    question: 'Qual o problema com a plataforma Exam.net?',
    options: [
      { text: 'Tela preta/Reiniciar', nextNodeId: 'end_instruct_examnet_restart' },
      { text: 'Código para sair', nextNodeId: 'end_instruct_examnet_quit_code' },
      { text: 'Quadrado cinzento', nextNodeId: 'end_instruct_examnet_grey_square' },
      { text: 'Outro', nextNodeId: 'end_ticket_examnet' },
    ],
  },
  'flow_mfa_aluno': {
    id: 'flow_mfa_aluno',
    question: 'Aluno com MFA ativado?',
    options: [
      { text: 'Criar ticket ServiceNow para remoção/redefinição', nextNodeId: 'end_ticket_mfa_aluno' },
    ],
  },
  'flow_erro500_canvas_mac': {
    id: 'flow_erro500_canvas_mac',
    question: 'Erro 500 ao carregar calendário de aulas Canvas utilizando um Mac (Safari)?',
    options: [
      { text: 'Instruir a desativar rastreamento de cookies no Safari', nextNodeId: 'end_instruct_safari_cookies' },
      { text: 'Sugerir Chrome/Firefox', nextNodeId: 'end_instruct_browser_alternativo' },
    ],
  },

  // --- Others Flow ---
  'others_start': { id: 'others_start', question: 'Por favor, descreva o problema.', options: [{ text: 'Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },


  // --- End Nodes (expanded and adjusted to European Portuguese) ---
  'end_success': { id: 'end_success', question: 'Problema resolvido com sucesso!', options: [] },
  'end_ticket': { id: 'end_ticket', question: 'Pedido de suporte criado. A equipa técnica entrará em contacto.', options: [] },
  'end_ticket_password': { id: 'end_ticket_password', question: 'Pedido de suporte para reset de palavra-passe criado.', options: [] },
  'end_ticket_fonte_problema': { id: 'end_ticket_fonte_problema', question: 'Pedido de suporte criado para verificação da fonte de alimentação.', options: [] },
  'end_ticket_diagnostico_video': { id: 'end_ticket_diagnostico_video', question: 'Pedido de suporte criado para diagnóstico de problema de vídeo (placa/monitor).', options: [] },
  'end_ticket_network_point': { id: 'end_ticket_network_point', question: 'Pedido de suporte criado para verificar ponto de rede e configurações.', options: [] },
  'end_ticket_massive': { id: 'end_ticket_massive', question: 'Alerta de problema massivo criado e enviado aos responsáveis.', options: [] },
  'end_instruct_connect_cable': { id: 'end_instruct_connect_cable', question: 'Instrua o utilizador a ligar o cabo firmemente. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_ligar_monitor': { id: 'end_instruct_ligar_monitor', question: 'Instrua o utilizador a ligar o monitor. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_conectar_cabo_video': { id: 'end_instruct_conectar_cabo_video', question: 'Instrua o utilizador a ligar o cabo de vídeo firmemente. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_ticket_problema_memoria': { id: 'end_ticket_problema_memoria', question: 'Pedido de suporte criado para diagnóstico de problema de memória RAM.', options: [] },
  'end_ticket_diagnostico_hardware': { id: 'end_ticket_diagnostico_hardware', question: 'Pedido de suporte criado para diagnóstico geral de hardware.', options: [] },
  'end_ticket_vpn': { id: 'end_ticket_vpn', question: 'Pedido de suporte criado para problema de conexão VPN.', options: [] },
  'end_ticket_firewall': { id: 'end_ticket_firewall', question: 'Pedido de suporte criado para ajuste de regras de firewall.', options: [] },
  'end_ticket_config_wifi': { id: 'end_ticket_config_wifi', question: 'Pedido de suporte criado para configuração de Wi-Fi.', options: [] },
  'end_instruct_wifi_reset': { id: 'end_instruct_wifi_reset', question: 'Instrua o utilizador a reiniciar o dispositivo e esquecer/reconectar a rede Wi-Fi. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_ticket_otimizacao_avancada': { id: 'end_ticket_otimizacao_avancada', question: 'Pedido de suporte criado para otimização avançada do sistema.', options: [] },
  'end_instruct_otimizacao_basica': { id: 'end_instruct_otimizacao_basica', question: 'Instrua o utilizador a realizar otimização básica. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_ticket_formatacao': { id: 'end_ticket_formatacao', question: 'Pedido de suporte criado para formatação e reinstalação do sistema.', options: [] },
  'end_ticket_instalacao_software': { id: 'end_ticket_instalacao_software', question: 'Pedido de suporte criado para instalação de software.', options: [] },
  'end_ticket_bug_office': { id: 'end_ticket_bug_office', question: 'Pedido de suporte criado para bug em software do pacote Office 365.', options: [] },
  'end_ticket_bug_teams': { id: 'end_ticket_bug_teams', question: 'Pedido de suporte criado para problema com Microsoft Teams.', options: [] },
  'end_ticket_bug_zoom': { id: 'end_ticket_bug_zoom', question: 'Pedido de suporte criado para problema com Zoom.', options: [] },
  'end_ticket_bug_software': { id: 'end_ticket_bug_software', question: 'Pedido de suporte criado para bug em software específico.', options: [] },
  'end_instruct_reset_senha_portal': { id: 'end_instruct_reset_senha_portal', question: 'Instrua o utilizador a usar a recuperação de palavra-passe do portal/email (password.europeia.pt). Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_ticket_reset_senha_geral': { id: 'end_ticket_reset_senha_geral', question: 'Pedido de suporte criado para reset de palavra-passe de outro serviço.', options: [] },
  'end_ticket_reset_senha_manual': { id: 'end_ticket_reset_senha_manual', question: 'Pedido de suporte criado para criação manual de palavra-passe.', options: [] },
  'end_ticket_reset_senha_externa': { id: 'end_ticket_reset_senha_externa', question: 'Pedido de suporte criado para palavra-passe externa.', options: [] },
  'end_ticket_lgpd': { id: 'end_ticket_lgpd', question: 'Pedido de suporte criado para consulta sobre LGPD/Segurança da Informação.', options: [] },
  'end_ticket_ransomware': { id: 'end_ticket_ransomware', question: 'Alerta de segurança criado para possível ransomware.', options: [] },
  'end_ticket_impressora': { id: 'end_ticket_impressora', question: 'Pedido de suporte criado para problema de impressora.', options: [] },
  'end_ticket_impressora_diagnostico': { id: 'end_ticket_impressora_diagnostico', question: 'Pedido de suporte criado para diagnóstico de impressora.', options: [] },
  'end_instruct_ligar_impressora': { id: 'end_instruct_ligar_impressora', question: 'Instrua o utilizador a ligar a impressora e verificar conexões. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_trocar_toner': { id: 'end_instruct_trocar_toner', question: 'Instrua o utilizador a trocar o toner/cartucho. Se não resolver, crie um pedido de suporte.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_ticket_solicitar_toner': { id: 'end_ticket_solicitar_toner', question: 'Pedido de suporte criado para solicitação de toner/cartucho.', options: [] },
  'end_ticket_periferico': { id: 'end_ticket_periferico', question: 'Pedido de suporte criado para problema de periférico/dispositivo.', options: [] },
  'end_ticket_ecra_tatil_toque': { id: 'end_ticket_ecra_tatil_toque', question: 'Pedido de suporte criado para ecrã tátil HyFlex sem resposta ao toque.', options: [] },
  'end_ticket_ecra_tatil_imagem': { id: 'end_ticket_ecra_tatil_imagem', question: 'Pedido de suporte criado para ecrã tátil HyFlex sem imagem.', options: [] },
  'end_kb_hyflex_guide': { id: 'end_kb_hyflex_guide', question: 'Redirecionando para a Base de Conhecimento: Guia de Utilização HyFlex.', options: [] },
  'end_ticket_webcam_nao_funciona': { id: 'end_ticket_webcam_nao_funciona', question: 'Pedido de suporte criado para webcam que não funciona.', options: [] },
  'end_ticket_webcam_problema_imagem': { id: 'end_ticket_webcam_problema_imagem', question: 'Pedido de suporte criado para problema de imagem/áudio da webcam.', options: [] },
  'end_ticket_energia': { id: 'end_ticket_energia', question: 'Pedido de suporte criado para problema com estabilizador/nobreak.', options: [] },
  'end_ticket_eletrica': { id: 'end_ticket_eletrica', question: 'Pedido de suporte criado para problema de fiação elétrica/tomada.', options: [] },
  'end_ticket_suporte': { id: 'end_ticket_suporte', question: 'Pedido de suporte criado para dúvida sobre processo de suporte.', options: [] },
  'end_kb_redirect': { id: 'end_kb_redirect', question: 'Redirecionando para a Base de Conhecimento para ferramentas.', options: [] },
  'end_ticket_manutencao_avancada': { id: 'end_ticket_manutencao_avancada', question: 'Pedido de suporte criado para manutenção avançada.', options: [] },
  'end_escalar_tecnico': { id: 'end_escalar_tecnico', question: 'Atendimento escalado para técnico especializado/grupo de TI.', options: [] },
  'end_encaminhar_secretaria': { id: 'end_encaminhar_secretaria', question: 'Encaminhar aluno para a Secretaria para questões de propinas.', options: [] },
  'end_encaminhar_secretaria_bloqueado': { id: 'end_encaminhar_secretaria_bloqueado', question: 'Aluno com propina em dívida. Encaminhar para a Secretaria.', options: [] },
  'end_instruct_verificar_sistema112': { id: 'end_instruct_verificar_sistema112', question: 'Instrua o utilizador a verificar o estado da propina no Sistema 112.', options: [{ text: 'Verificado, problema persiste', nextNodeId: 'aluno_propinas_sistema112' }] },
  'end_encaminhar_nucleo_aluno': { id: 'end_encaminhar_nucleo_aluno', question: 'Encaminhar aluno para o Núcleo de Atendimento ao Aluno para dúvidas de pagamento.', options: [] },
  'end_ticket_planeamento_aulas': { id: 'end_ticket_planeamento_aulas', question: 'Pedido de suporte criado para aulas não visíveis no planeamento.', options: [] },
  'end_ticket_planeamento_chamadas': { id: 'end_ticket_planeamento_chamadas', question: 'Pedido de suporte criado para chamadas não visíveis no planeamento.', options: [] },
  'end_ticket_software_autocad': { id: 'end_ticket_software_autocad', question: 'Pedido de suporte criado para problema com AutoCAD.', options: [] },
  'end_ticket_software_maxqda': { id: 'end_ticket_software_maxqda', question: 'Pedido de suporte criado para problema com MAXQDA.', options: [] },
  'end_ticket_software_spss': { id: 'end_ticket_software_spss', question: 'Pedido de suporte criado para problema com IBM SPSS.', options: [] },
  'end_ticket_software_adobe': { id: 'end_ticket_software_adobe', question: 'Pedido de suporte criado para problema com Adobe Creative Cloud.', options: [] },
  'end_ticket_software_academico_geral': { id: 'end_ticket_software_academico_geral', question: 'Pedido de suporte criado para problema com software académico específico.', options: [] },
  // Novos nós de fim para fluxos de atendimento
  'end_instruct_teams_canvas_aula': { id: 'end_instruct_teams_canvas_aula', question: 'Instruir a verificar Teams e Canvas. Se não resolver, encaminhar para professor/gestor académico.', options: [{ text: 'Problema Persiste, Encaminhar', nextNodeId: 'end_encaminhar_professor_gestor' }] },
  'end_encaminhar_professor_gestor': { id: 'end_encaminhar_professor_gestor', question: 'Encaminhar para professor ou gestor académico.', options: [] },
  'end_instruct_pwm_desbloquear': { id: 'end_instruct_pwm_desbloquear', question: 'Instruir a desbloquear a conta via PWM Admin.', options: [{ text: 'Resolvido', nextNodeId: 'end_success' }] },
  'end_instruct_email_check': { id: 'end_instruct_email_check', question: 'Instruir a verificar 112, PWM e Canvas para bloqueios de email.', options: [{ text: 'Problema Persiste, Encaminhar', nextNodeId: 'end_encaminhar_servicos_academicos' }] },
  'end_encaminhar_servicos_academicos': { id: 'end_encaminhar_servicos_academicos', question: 'Encaminhar para Serviços Académicos (aluno novo ou integração).', options: [] },
  'end_instruct_servicenow_check': { id: 'end_instruct_servicenow_check', question: 'Instruir a verificar erro, link correto e PWM para ServiceNow.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_ticket_servicenow_sso_reset': { id: 'end_ticket_servicenow_sso_reset', question: 'Pedido de suporte criado para reset de SSO no ServiceNow (dispositivo diferente).', options: [] },
  'end_instruct_hyflex_rececao_it': { id: 'end_instruct_hyflex_rececao_it', question: 'Instruir a contactar a receção ou linha de atendimento IT para assistência HyFlex.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_hyflex_smartmirror': { id: 'end_instruct_hyflex_smartmirror', question: 'Instruir sobre o uso do SmartMirror no HyFlex (Home/Android, app SmartMirror, smartmirror.link).', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_examnet_restart': { id: 'end_instruct_examnet_restart', question: 'Instruir a reiniciar o PC e reinstalar o SafeBrowser para Exam.net (tela preta).', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_examnet_quit_code': { id: 'end_instruct_examnet_quit_code', question: 'Fornecer código para sair do Exam.net: EXAMnetQUIT2017.', options: [{ text: 'Resolvido', nextNodeId: 'end_success' }] },
  'end_instruct_examnet_grey_square': { id: 'end_instruct_examnet_grey_square', question: 'Informar que o quadrado cinzento no Exam.net não é um problema.', options: [{ text: 'Resolvido', nextNodeId: 'end_success' }] },
  'end_ticket_examnet': { id: 'end_ticket_examnet', question: 'Pedido de suporte criado para problema na plataforma Exam.net.', options: [] },
  'end_ticket_mfa_aluno': { id: 'end_ticket_mfa_aluno', question: 'Ticket ServiceNow criado para remoção/redefinição de MFA de aluno.', options: [] },
  'end_instruct_safari_cookies': { id: 'end_instruct_safari_cookies', question: 'Instruir a desativar "Impedir rastreamento entre sites" em Safari > Preferências > Privacidade.', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
  'end_instruct_browser_alternativo': { id: 'end_instruct_browser_alternativo', question: 'Sugerir o uso de Google Chrome ou Mozilla Firefox para resolver o erro 500 no Canvas (Mac).', options: [{ text: 'Problema Persiste, Criar Pedido de Suporte', nextNodeId: 'end_ticket' }] },
};
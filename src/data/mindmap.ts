import { Cpu, Wifi, AppWindow, KeyRound, UserCheck, CalendarPlus, AlertTriangle, MoreHorizontal, HardDrive, Monitor, Speaker, Wrench, Cable, Router, Server, Database, Shield, Lock, Printer, Camera, BatteryCharging, Lightbulb, Handshake, FileText, FlaskConical } from 'lucide-react';

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
  { id: 'others', name: 'Outros', icon: MoreHorizontal, startNodeId: 'others_start' },
];

export const mindmapData: Record<string, MindmapNode> = {
  // --- Hardware e Montagem Flow ---
  'hardware_start': {
    id: 'hardware_start',
    question: 'Qual o problema de hardware?',
    options: [
      { text: 'PC não liga', nextNodeId: 'pc_nao_liga_start' },
      { text: 'PC liga mas não dá tela', nextNodeId: 'pc_liga_nao_da_tela_start' },
      { text: 'Barulhos/sons/bipes', nextNodeId: 'barulhos_bipes_start' },
      { text: 'Outro', nextNodeId: 'hardware_outros' },
    ],
  },
  'pc_nao_liga_start': {
    id: 'pc_nao_liga_start',
    question: 'O cabo de força está conectado corretamente na tomada e no PC?',
    options: [
      { text: 'Sim', nextNodeId: 'pc_nao_liga_fonte_barulho' },
      { text: 'Não', nextNodeId: 'end_instruct_connect_cable' },
    ],
  },
  'pc_nao_liga_fonte_barulho': {
    id: 'pc_nao_liga_fonte_barulho',
    question: 'A fonte de alimentação faz algum barulho ou cheiro de queimado?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_fonte_problema' },
      { text: 'Não', nextNodeId: 'end_ticket_diagnostico_hardware' },
    ],
  },
  'pc_liga_nao_da_tela_start': {
    id: 'pc_liga_nao_da_tela_start',
    question: 'O monitor está ligado e conectado ao PC?',
    options: [
      { text: 'Sim', nextNodeId: 'pc_liga_nao_da_tela_cabo_video' },
      { text: 'Não', nextNodeId: 'end_instruct_ligar_monitor' },
    ],
  },
  'pc_liga_nao_da_tela_cabo_video': {
    id: 'pc_liga_nao_da_tela_cabo_video',
    question: 'O cabo de vídeo está firmemente conectado em ambas as pontas?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_diagnostico_video' },
      { text: 'Não', nextNodeId: 'end_instruct_conectar_cabo_video' },
    ],
  },
  'barulhos_bipes_start': {
    id: 'barulhos_bipes_start',
    question: 'Qual o padrão de bipes ou tipo de barulho?',
    options: [
      { text: 'Bipes contínuos/longos', nextNodeId: 'end_ticket_problema_memoria' },
      { text: 'Barulho de HD/ventoinha', nextNodeId: 'end_ticket_diagnostico_hardware' },
      { text: 'Outro', nextNodeId: 'end_ticket_diagnostico_hardware' },
    ],
  },
  'hardware_outros': { id: 'hardware_outros', question: 'Por favor, descreva o problema de hardware.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- Redes e Conectividade Flow ---
  'redes_start': {
    id: 'redes_start',
    question: 'Qual o problema de rede?',
    options: [
      { text: 'Não acessa internet/rede', nextNodeId: 'network_check_cable' },
      { text: 'Problema com VPN/Firewall', nextNodeId: 'vpn_firewall_start' },
      { text: 'Configuração de IP/Wi-Fi', nextNodeId: 'config_ip_wifi_start' },
      { text: 'Outro', nextNodeId: 'redes_outros' },
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
  'vpn_firewall_start': {
    id: 'vpn_firewall_start',
    question: 'O problema é com acesso à VPN ou bloqueio de firewall?',
    options: [
      { text: 'VPN não conecta', nextNodeId: 'end_ticket_vpn' },
      { text: 'Site/serviço bloqueado', nextNodeId: 'end_ticket_firewall' },
    ],
  },
  'config_ip_wifi_start': {
    id: 'config_ip_wifi_start',
    question: 'Precisa configurar IP fixo ou Wi-Fi?',
    options: [
      { text: 'Configurar IP fixo', nextNodeId: 'end_ticket_config_ip' },
      { text: 'Configurar Wi-Fi', nextNodeId: 'end_ticket_config_wifi' },
    ],
  },
  'redes_outros': { id: 'redes_outros', question: 'Por favor, descreva o problema de rede.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- Sistemas Operacionais e Software Flow ---
  'sistemas_start': {
    id: 'sistemas_start',
    question: 'Qual o problema com sistema operacional ou software?',
    options: [
      { text: 'PC lento/otimização', nextNodeId: 'otimizacao_windows_start' },
      { text: 'Instalação/formatação', nextNodeId: 'instalacao_formatacao_start' },
      { text: 'Bugs específicos', nextNodeId: 'bugs_especificos_start' },
      { text: 'Outro', nextNodeId: 'sistemas_outros' },
    ],
  },
  'otimizacao_windows_start': {
    id: 'otimizacao_windows_start',
    question: 'Já tentou reiniciar o PC e limpar arquivos temporários?',
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
  'bugs_especificos_start': {
    id: 'bugs_especificos_start',
    question: 'Qual software está apresentando o bug?',
    options: [
      { text: 'Excel/Office', nextNodeId: 'end_ticket_bug_office' },
      { text: 'Sistema Contábil', nextNodeId: 'end_ticket_bug_contabil' },
      { text: 'Outro', nextNodeId: 'end_ticket_bug_software' },
    ],
  },
  'sistemas_outros': { id: 'sistemas_outros', question: 'Por favor, descreva o problema de sistema/software.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- Segurança e Governança Flow ---
  'seguranca_start': {
    id: 'seguranca_start',
    question: 'Qual o tópico de segurança?',
    options: [
      { text: 'LGPD/Segurança da Informação', nextNodeId: 'lgpd_si_start' },
      { text: 'Ransomware/Proteção', nextNodeId: 'ransomware_start' },
      { text: 'Segurança de Senhas', nextNodeId: 'seguranca_senhas_start' },
      { text: 'Outro', nextNodeId: 'seguranca_outros' },
    ],
  },
  'lgpd_si_start': { id: 'lgpd_si_start', question: 'Qual a dúvida sobre LGPD/Segurança da Informação?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_lgpd' }] },
  'ransomware_start': { id: 'ransomware_start', question: 'Suspeita de ataque de ransomware ou precisa de proteção?', options: [{ text: 'Criar Alerta de Segurança', nextNodeId: 'end_ticket_ransomware' }] },
  'seguranca_senhas_start': { id: 'seguranca_senhas_start', question: 'Precisa de orientações sobre segurança de senhas?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_seguranca_senhas' }] },
  'seguranca_outros': { id: 'seguranca_outros', question: 'Por favor, descreva o tópico de segurança.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- Periféricos e Dispositivos Flow ---
  'perifericos_start': {
    id: 'perifericos_start',
    question: 'Qual o problema com periféricos/dispositivos?',
    options: [
      { text: 'Impressora', nextNodeId: 'impressora_start' },
      { text: 'Monitor/Webcam', nextNodeId: 'monitor_webcam_start' },
      { text: 'Mouse/Teclado/USB', nextNodeId: 'mouse_teclado_usb_start' },
      { text: 'Outro', nextNodeId: 'perifericos_outros' },
    ],
  },
  'impressora_start': {
    id: 'impressora_start',
    question: 'A impressora está ligada e conectada?',
    options: [
      { text: 'Sim', nextNodeId: 'end_ticket_impressora' },
      { text: 'Não', nextNodeId: 'end_instruct_ligar_impressora' },
    ],
  },
  'monitor_webcam_start': { id: 'monitor_webcam_start', question: 'Qual o problema com monitor ou webcam?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_periferico' }] },
  'mouse_teclado_usb_start': { id: 'mouse_teclado_usb_start', question: 'Qual o problema com mouse, teclado ou dispositivo USB?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_periferico' }] },
  'perifericos_outros': { id: 'perifericos_outros', question: 'Por favor, descreva o problema com periféricos.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

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
  'estabilizador_nobreak_start': { id: 'estabilizador_nobreak_start', question: 'Problema com estabilizador ou nobreak?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_energia' }] },
  'tomada_fiacao_start': { id: 'tomada_fiacao_start', question: 'Problema com tomada ou fiação elétrica?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_eletrica' }] },
  'energia_outros': { id: 'energia_outros', question: 'Por favor, descreva o problema de energia.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

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
  'duvida_atendimento_start': { id: 'duvida_atendimento_start', question: 'Qual a dúvida sobre o processo de atendimento?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_suporte' }] },
  'ferramentas_indispensaveis_start': { id: 'ferramentas_indispensaveis_start', question: 'Precisa de informações sobre ferramentas de suporte?', options: [{ text: 'Consultar Base de Conhecimento', nextNodeId: 'end_kb_redirect' }] },
  'suporte_outros': { id: 'suporte_outros', question: 'Por favor, descreva o tópico de suporte.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- Manutenção Avançada Flow ---
  'manutencao_avancada_start': {
    id: 'manutencao_avancada_start',
    question: 'Qual o tipo de manutenção avançada?',
    options: [
      { text: 'Limpeza/Troca de Pasta Térmica', nextNodeId: 'limpeza_pasta_termica_start' },
      { text: 'Diagnóstico de Hardware', nextNodeId: 'diagnostico_hardware_avancado_start' },
      { text: 'Eletrônica Básica', nextNodeId: 'eletronica_basica_start' },
      { text: 'Outro', nextNodeId: 'manutencao_avancada_outros' },
    ],
  },
  'limpeza_pasta_termica_start': { id: 'limpeza_pasta_termica_start', question: 'Precisa de guia para limpeza ou troca de pasta térmica?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_manutencao_avancada' }] },
  'diagnostico_hardware_avancado_start': { id: 'diagnostico_hardware_avancado_start', question: 'Precisa de ajuda com diagnóstico avançado de hardware?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_manutencao_avancada' }] },
  'eletronica_basica_start': { id: 'eletronica_basica_start', question: 'Dúvidas sobre eletrônica básica (bateria, jumper)?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket_manutencao_avancada' }] },
  'manutencao_avancada_outros': { id: 'manutencao_avancada_outros', question: 'Por favor, descreva o tópico de manutenção avançada.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- Existing Flows (simplified for brevity in this update) ---
  'apps_start': { id: 'apps_start', question: 'Qual aplicação está com problema?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },
  'password_start': { id: 'password_start', question: 'O usuário precisa de um reset de senha?', options: [{ text: 'Sim', nextNodeId: 'end_ticket_password' }, { text: 'Não', nextNodeId: 'end_ticket' }] },
  'presential_start': { id: 'presential_start', question: 'Agendar atendimento presencial para qual localidade e horário?', options: [{ text: 'Agendar e Criar Ticket', nextNodeId: 'end_ticket' }] },
  'event_start': { id: 'event_start', question: 'Qual equipamento precisa ser preparado para o evento?', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },
  'massive_start': { id: 'massive_start', question: 'Qual sistema ou serviço está fora do ar? Descreva o impacto.', options: [{ text: 'Criar Alerta Geral', nextNodeId: 'end_ticket_massive' }] },
  'others_start': { id: 'others_start', question: 'Por favor, descreva o problema em detalhes.', options: [{ text: 'Criar Ticket', nextNodeId: 'end_ticket' }] },

  // --- End Nodes (expanded) ---
  'end_success': { id: 'end_success', question: 'Problema resolvido com sucesso!', options: [] },
  'end_ticket': { id: 'end_ticket', question: 'Ticket de suporte criado. A equipe técnica entrará em contato.', options: [] },
  'end_ticket_password': { id: 'end_ticket_password', question: 'Ticket para reset de senha criado.', options: [] },
  'end_ticket_power_supply': { id: 'end_ticket_power_supply', question: 'Ticket criado para verificação da fonte de alimentação.', options: [] },
  'end_ticket_video_issue': { id: 'end_ticket_video_issue', question: 'Ticket criado para problema de vídeo.', options: [] },
  'end_ticket_network_point': { id: 'end_ticket_network_point', question: 'Ticket criado para verificar ponto de rede e configurações.', options: [] },
  'end_ticket_massive': { id: 'end_ticket_massive', question: 'Alerta de problema massivo criado e enviado aos responsáveis.', options: [] },
  'end_instruct_connect_cable': { id: 'end_instruct_connect_cable', question: 'Instrua o usuário a conectar o cabo firmemente. Se não resolver, crie um ticket.', options: [{ text: 'Problema Persiste, Criar Ticket', nextNodeId: 'end_ticket' }] },
  'end_ticket_fonte_problema': { id: 'end_ticket_fonte_problema', question: 'Ticket criado para substituição/diagnóstico da fonte de alimentação.', options: [] },
  'end_instruct_ligar_monitor': { id: 'end_instruct_ligar_monitor', question: 'Instrua o usuário a ligar o monitor. Se não resolver, crie um ticket.', options: [{ text: 'Problema Persiste, Criar Ticket', nextNodeId: 'end_ticket' }] },
  'end_instruct_conectar_cabo_video': { id: 'end_instruct_conectar_cabo_video', question: 'Instrua o usuário a conectar o cabo de vídeo firmemente. Se não resolver, crie um ticket.', options: [{ text: 'Problema Persiste, Criar Ticket', nextNodeId: 'end_ticket' }] },
  'end_ticket_diagnostico_video': { id: 'end_ticket_diagnostico_video', question: 'Ticket criado para diagnóstico de problema de vídeo (placa/monitor).', options: [] },
  'end_ticket_problema_memoria': { id: 'end_ticket_problema_memoria', question: 'Ticket criado para diagnóstico de problema de memória RAM.', options: [] },
  'end_ticket_diagnostico_hardware': { id: 'end_ticket_diagnostico_hardware', question: 'Ticket criado para diagnóstico geral de hardware.', options: [] },
  'end_ticket_vpn': { id: 'end_ticket_vpn', question: 'Ticket criado para problema de conexão VPN.', options: [] },
  'end_ticket_firewall': { id: 'end_ticket_firewall', question: 'Ticket criado para ajuste de regras de firewall.', options: [] },
  'end_ticket_config_ip': { id: 'end_ticket_config_ip', question: 'Ticket criado para configuração de IP fixo.', options: [] },
  'end_ticket_config_wifi': { id: 'end_ticket_config_wifi', question: 'Ticket criado para configuração de Wi-Fi.', options: [] },
  'end_ticket_otimizacao_avancada': { id: 'end_ticket_otimizacao_avancada', question: 'Ticket criado para otimização avançada do sistema.', options: [] },
  'end_instruct_otimizacao_basica': { id: 'end_instruct_otimizacao_basica', question: 'Instrua o usuário a realizar otimização básica. Se não resolver, crie um ticket.', options: [{ text: 'Problema Persiste, Criar Ticket', nextNodeId: 'end_ticket' }] },
  'end_ticket_formatacao': { id: 'end_ticket_formatacao', question: 'Ticket criado para formatação e reinstalação do sistema.', options: [] },
  'end_ticket_instalacao_software': { id: 'end_ticket_instalacao_software', question: 'Ticket criado para instalação de software.', options: [] },
  'end_ticket_bug_office': { id: 'end_ticket_bug_office', question: 'Ticket criado para bug em software do pacote Office.', options: [] },
  'end_ticket_bug_contabil': { id: 'end_ticket_bug_contabil', question: 'Ticket criado para bug em software contábil.', options: [] },
  'end_ticket_bug_software': { id: 'end_ticket_bug_software', question: 'Ticket criado para bug em software específico.', options: [] },
  'end_ticket_lgpd': { id: 'end_ticket_lgpd', question: 'Ticket criado para consulta sobre LGPD/Segurança da Informação.', options: [] },
  'end_ticket_ransomware': { id: 'end_ticket_ransomware', question: 'Alerta de segurança criado para possível ransomware.', options: [] },
  'end_ticket_seguranca_senhas': { id: 'end_ticket_seguranca_senhas', question: 'Ticket criado para orientações de segurança de senhas.', options: [] },
  'end_ticket_impressora': { id: 'end_ticket_impressora', question: 'Ticket criado para problema de impressora.', options: [] },
  'end_instruct_ligar_impressora': { id: 'end_instruct_ligar_impressora', question: 'Instrua o usuário a ligar a impressora e verificar conexões. Se não resolver, crie um ticket.', options: [{ text: 'Problema Persiste, Criar Ticket', nextNodeId: 'end_ticket' }] },
  'end_ticket_periferico': { id: 'end_ticket_periferico', question: 'Ticket criado para problema de periférico/dispositivo.', options: [] },
  'end_ticket_energia': { id: 'end_ticket_energia', question: 'Ticket criado para problema com estabilizador/nobreak.', options: [] },
  'end_ticket_eletrica': { id: 'end_ticket_eletrica', question: 'Ticket criado para problema de fiação elétrica/tomada.', options: [] },
  'end_ticket_suporte': { id: 'end_ticket_suporte', question: 'Ticket criado para dúvida sobre processo de suporte.', options: [] },
  'end_kb_redirect': { id: 'end_kb_redirect', question: 'Redirecionando para a Base de Conhecimento para ferramentas.', options: [] },
  'end_ticket_manutencao_avancada': { id: 'end_ticket_manutencao_avancada', question: 'Ticket criado para manutenção avançada.', options: [] },
  'end_escalar_tecnico': { id: 'end_escalar_tecnico', question: 'Atendimento escalado para técnico especializado/grupo de TI.', options: [] },
};
import { Article } from '@/components/ArticleForm';
import { BlogPost } from '@/components/BlogPostCard'; // Import BlogPost type
import { format } from 'date-fns';

// --- Mock Data Storage (using localStorage for persistence) ---
const getArticles = (): Article[] => {
  const storedArticles = localStorage.getItem('mockArticles');
  return storedArticles ? JSON.parse(storedArticles) : [];
};

const saveArticles = (articles: Article[]) => {
  localStorage.setItem('mockArticles', JSON.stringify(articles));
};

const getBlogPosts = (): BlogPost[] => {
  const storedPosts = localStorage.getItem('mockBlogPosts');
  if (storedPosts) {
    return JSON.parse(storedPosts).map((post: any) => ({
      ...post,
      publishedAt: new Date(post.publishedAt),
    }));
  }
  return [];
};

const saveBlogPosts = (posts: BlogPost[]) => {
  localStorage.setItem('mockBlogPosts', JSON.stringify(posts));
};

// --- Article API (exported) ---
export const apiGetArticles = (): Article[] => {
  return getArticles();
};

export const apiAddArticle = (newArticleData: Omit<Article, 'id'>): Article => {
  const currentArticles = getArticles();
  const newArticle: Article = {
    ...newArticleData,
    id: `kb-${Date.now()}`, // Simple ID generation
  };
  saveArticles([newArticle, ...currentArticles]); // Add new to top
  return newArticle;
};

export const apiUpdateArticle = (updatedArticleData: Article) => {
  const currentArticles = getArticles();
  const updatedArticles = currentArticles.map(a =>
    a.id === updatedArticleData.id ? updatedArticleData : a
  );
  saveArticles(updatedArticles);
};

export const apiDeleteArticle = (articleId: string) => {
  const currentArticles = getArticles();
  const updatedArticles = currentArticles.filter(a => a.id !== articleId);
  saveArticles(updatedArticles);
};

// --- Blog Post API (exported) ---
export const apiGetBlogPosts = (): BlogPost[] => {
  return getBlogPosts().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};

export const apiAddBlogPost = (newPostData: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost => {
  const currentPosts = getBlogPosts();
  const newPost: BlogPost = {
    ...newPostData,
    id: `blog-${Date.now()}`,
    publishedAt: new Date(),
  };
  saveBlogPosts([newPost, ...currentPosts]);
  return newPost;
};

export const apiUpdateBlogPost = (updatedPostData: BlogPost) => {
  const currentPosts = getBlogPosts();
  const updatedPosts = currentPosts.map(p =>
    p.id === updatedPostData.id ? { ...updatedPostData, publishedAt: new Date(updatedPostData.publishedAt) } : p
  );
  saveBlogPosts(updatedPosts);
};

export const apiDeleteBlogPost = (postId: string) => {
  const currentPosts = getBlogPosts();
  const updatedPosts = currentPosts.filter(p => p.id !== postId);
  saveBlogPosts(updatedPosts);
};


// --- Initial Data (if localStorage is empty) ---
const initializeArticles = () => {
  let articles: Article[] = getArticles();
  if (articles.length === 0) {
    articles = [
      { id: 'kb-1', title: 'Como configurar a impressora de rede?', content: '1. Abra o Painel de Controlo...\n2. Vá em "Dispositivos e Impressoras"...\n3. Clique em "Adicionar uma impressora"...', category: 'Periféricos e Impressoras' },
      { id: 'kb-2', title: 'Como aceder à VPN da empresa?', content: 'Abra o cliente Cisco AnyConnect...\nDigite o endereço vpn.suaempresa.com.pt...', category: 'Rede e Wi-Fi' },
      { id: 'kb-3', title: 'O que fazer quando um software bloqueia?', content: 'Primeiro, tente fechar o programa pelo Gestor de Tarefas (Ctrl+Shift+Esc).', category: 'Sistemas Operacionais' },
      { id: 'kb-4', title: 'Guia de Segurança de Palavras-passe', content: 'Use palavras-passe fortes e únicas. Não partilhe as suas palavras-passe.', category: 'Segurança e Acessos' },
      { id: 'kb-5', title: 'Resolução de Problemas de Ecrã Tátil HyFlex', content: 'Verifique as conexões de vídeo e USB. Calibre o ecrã se necessário.', category: 'Periféricos e Impressoras' },
      { id: 'kb-6', title: 'Configuração de Email Institucional', content: 'Passos para configurar o email da universidade em diferentes clientes de email.', category: 'Sistemas Académicos (Canvas, Exam.net)' },
      { id: 'kb-7', title: 'Utilização do Microsoft Teams para Aulas', content: 'Guia rápido para professores e alunos sobre como usar o Teams para reuniões e partilha de ficheiros.', category: 'Sistemas Académicos (Canvas, Exam.net)' },
      { id: 'kb-8', title: 'Boas Práticas de Atendimento ao Aluno', content: 'Dicas para um atendimento eficiente e empático a alunos com problemas técnicos.', category: 'Atendimento Aluno' },
      // Novos artigos das suas anotações
      { id: 'kb-9', title: 'Adobe Creative Cloud - Suporte', content: 'O Adobe Creative Cloud não oferece suporte para sistemas operativos Ubuntu ou Linux. A conta e licença da Autodesk é gerida pelo aluno e não pelo IT. Aconselha-se a contatar o suporte da Autodesk para renovar a licença.', category: 'Software' },
      { id: 'kb-10', title: 'Acesso Wi-Fi Alunos', content: 'Para alunos que não acedem ao Wi-Fi: verificar se o aluno está no grupo "wifi alunos" no domínio. Conectar ao Wi-Fi UE-STUDENTS, selecione EAP/PEAP, use MSCHAPV2 e escolha confiar ou não no certificado. Insira suas credenciais e conecte-se.', category: 'Rede e Wi-Fi' },
      { id: 'kb-11', title: 'MFA Ativado (Alunos)', content: 'Para aluno com MFA ativado: criar um ticket no ServiceNow solicitando remoção/redefinição do MFA e encaminhar para a torre 365.', category: 'Segurança e Acessos' },
      { id: 'kb-12', title: 'Acesso Canvas/Portal Aluno', content: 'Utilizar o número de aluno (apenas o número, sem o @) e a sua password para aceder ao portal do aluno e ao Canvas (https://www.mycampus.pt/).', category: 'Sistemas Académicos (Canvas, Exam.net)' },
      { id: 'kb-13', title: 'Conta Bloqueada (Excesso de Tentativas)', content: 'Entrar como PWM Admin e desbloquear a conta do aluno.', category: 'Segurança e Acessos' },
      { id: 'kb-14', title: 'Erro 500 Calendário Canvas (Mac/Safari)', content: 'Erro 500 ao carregar calendário de aulas Canvas utilizando um Mac (Safari): necessário ir em Configurações/Privacidade/desativar a opção de rastrear cookies. Reiniciar o navegador após a alteração.', category: 'Sistemas Académicos (Canvas, Exam.net)' },
      { id: 'kb-15', title: 'Acessos ServiceNow', content: 'suporte.helpdesk.portugal@universidadeeuropeia.pt (SSO), pass: Ow***$. Abrir em janela anónima.', category: 'Segurança e Acessos' },
      { id: 'kb-16', title: 'Acessos Wi-Fi (Geral)', content: 'Wi-Fi minimodem Vodafone: UNIVERSIDADE_EUROPEIA, PASSWORD: Europeia2025. Wi-Fi UE-EVENTS: UE-Ev3.2025. Docentes: UE-Faculty (credenciais Canvas). Staff: UE-Employees (credenciais PC).', category: 'Rede e Wi-Fi' },
      { id: 'kb-17', title: 'Acessos Teams Provas Online', content: 'Conta Teams para helpdesk das provas online: ithelpdesk@universidadeeuropeia.pt, password: st3ipPends.', category: 'Sistemas Académicos (Canvas, Exam.net)' },
      { id: 'kb-18', title: 'IP Servidor Impressão', content: 'IP servidor impressão Windows geral: \\\\172.26.2.12 (entrar com conta admin).', category: 'Infraestrutura e Servidores' },
      { id: 'kb-19', title: 'Telefones de Apoio', content: 'Linha de apoio ao estudante: QBN: 213 939 680, OGC e outros: 213 939 690. Linha de apoio IT Helpdesk: 21 030 9990. Segurança: 964 161 141.', category: 'Contactos e Informações' },
      { id: 'kb-20', title: 'Dados da Empresa', content: 'Oriente Green Campus - Universidade Europeia. Ensilis, NIF: 504 669 788. Cód. Postal: 1886-502 (OGC/IADE), 1500-210 (Quintas Bom Nome - Carnide).', category: 'Contactos e Informações' },
      { id: 'kb-21', title: 'IPs de Servidores', content: 'Servidor de impressão: 172.26.2.12. Servidor Domínio Employees: 172.26.2.10. Servidor Domínio Alunos: 172.23.44.7. Servidor Storage Alunos: 172.26.3.10. Servidor Pasta Share: \\\\172.23.66.2. Servidor VPN Alunos: vpnalunos.europeia.pt ou 161.230.195.12:8443. Servidor MAXQDA: 172.23.66.5:8443. Servidor VPN Staff: vpn.europeia.pt:8443.', category: 'Infraestrutura e Servidores' },
      { id: 'kb-22', title: 'Aplicações Comuns (Windows/Mac)', content: '112.EXE, Bullet Calendar, Teams, VPN, Microsoft 365, Adobe Creative Cloud, Autodesk AutoCAD, SPSS, Crowdstrike Falcon, CiscoAMP, SCCM, Umbrella, Office 365, Project, Visio, Deepfreeze Cloud.', category: 'Aplicações' },
      { id: 'kb-23', title: 'Plataforma Exam.net - Suporte', content: 'Para provas online. Alunos instalam SafeBrowser (Respondus). Dúvidas via Teams (ithelpdesk@universidadeeuropeia.pt, pass: st3ipPends). Códigos para sair: EXAMnetQUIT2017. Quadrado cinzento não é problema.', category: 'Sistemas Académicos (Canvas, Exam.net)' },
      { id: 'kb-24', title: 'Modelo de Resposta - Suporte ServiceNow', content: 'Olá [NOME], bom dia! Informamos que todo o suporte do IT Helpdesk é realizado exclusivamente através da plataforma: \n🔗https://europaeducationgroup.service-now.com/login_locate_sso.do\n Agradecemos que utilize este canal para submeter os seus pedidos de suporte de IT.', category: 'Modelos de Resposta' },
      { id: 'kb-25', title: 'Modelo de Resposta - Erro 500 (Safari)', content: 'Olá [NOME DO ALUNOA],\nO erro que está a ocorrer deve-se a uma limitação específica do navegador Safari. Para resolver a situação, sugerimos que utilize um navegador alternativo, como o Google Chrome ou o Mozilla Firefox, que não apresentam esta restrição.\nCaso prefira manter o Safari, será necessário desativar a opção de privacidade que causa o problema. Para isso, aceda a Safari → Preferências → Privacidade e desmarque a opção Impedir rastreamento entre sites. Reinicie o navegador após efetuar a alteração.\nEstamos disponíveis para ajudar caso necessite de mais suporte.\nCom os melhores cumprimentos,\nEquipa de Helpdesk', category: 'Modelos de Resposta' },
      { id: 'kb-26', title: 'Modelo de Resposta - Autodesk Licença', content: 'Boa tarde,\nA conta e licença da Autodesk é gerida pelo aluno e não pelo IT.\nAconselho-a a contatar o suporte da Autodesk para que lhe indiquem os passos para renovar a sua licença.\nCumprimentos', category: 'Modelos de Resposta' },
      { id: 'kb-27', title: 'Modelo de Resposta - Login Utilizador IPAM', content: 'Cara Aluna,\nEm resposta ao seu contacto, informamos que o endereço de email associado à sua conta no IPAM para efeitos de login é:\nLogin: 12034@ipam.pt\nPode utilizar este endereço para aceder à sua Área de Estudante e a todos os serviços online do IPAM.\nCaso se tenha esquecido da sua palavra-passe, deverá:\nAceder ao portal passwords.europeia.pt\nClicar na opção "Senha Esquecida"\nSeguir as instruções apresentadas para repor a sua palavra-passe\nSe encontrar alguma dificuldade no acesso, não hesite em contactar-nos.\nCom os melhores cumprimentos,', category: 'Modelos de Resposta' },
      { id: 'kb-28', title: 'Modelo de Resposta - Problemas Acesso (30 min)', content: 'Boa tarde,\nObrigada pelo seu contacto. Lamentamos a dificuldade que está a ter no acesso às aulas via Teams.\nPode tentar novamente dentro de 30 minutos, pois este tipo de problema costuma ser resolvido rapidamente pelo sistema.\nAgradecemos a sua compreensão.\nCumprimentos,\nEquipa de Suporte', category: 'Modelos de Resposta' },
      { id: 'kb-29', title: 'Modelo de Resposta - Redefinir Palavra-passe', content: 'Aceda a password.europeia.pt\n-entre em RECUPERAR PASSWORD\n-Escolha se deseja receber o código de desbloqueio por email ou SMS\n-Insira o código recebido na caixa indicada\n-Redefina a palavra-passe\n-Agradecemos que utilize este canal para submeter os seus pedidos de suporte de IT.', category: 'Modelos de Resposta' },
      { id: 'kb-30', title: 'Modelo de Resposta - Agendamento Presencial MAXQDA', content: 'Olá,\nFico ao seu dispor para a auxiliar com a instalação do MAXQDA. Estarei disponível hoje (sexta-feira), das 14h às 20h, na sala de IT do Campus OGC, bem como durante a semana.\nSolicito, por favor, que confirme o horário que melhor se adequa à sua disponibilidade, de forma a podermos agendar.\nDurante este período, poderá dirigir-se diretamente à sala de IT.\nCom os melhores cumprimentos,\nDaniel Oliveira', category: 'Modelos de Resposta' },
      { id: 'kb-31', title: 'Modelo de Resposta - Acesso Respondus', content: 'Informamos que já tem acesso a comunidade respondus.\nAgradecemos que utilize este canal para submeter os seus pedidos de suporte de IT.\nAtenciosamente,\nEquipa IT', category: 'Modelos de Resposta' },
      { id: 'kb-32', title: 'Checklist Instalação Computadores Windows', content: '- [ ] Connect Wifi UE-Students 5008888\n- [ ] RENOMEIA HOST PARA: PTOGC-SERIAL\n- [ ] INSTALL WINDOWS UPDATES\n- [ ] INSTALL CROWDSTRIKE FALCON\n- [ ] INSTALL SPSS\n- [ ] + INSTALL SCCM\n- [ ] INSTALL UMBRELLA\n- [ ] WORD\n- [ ] PROJECT\n- [ ] VISIO\n- [ ] ADD ACTIVE DIRECTORY: alunos.universidadeeuropeia.pt\n- [ ] REMOVE "IT" ACCOUNT\n- [ ] ADD "Suporte" ACCOUNT\n- [ ] ACRESCENTAR O HOST A PASTA CORRETA NO AD SERVER\n- [ ] + ADD BIOS PASSWORD "NOVAPASS"', category: 'Procedimentos e Checklists' },
      { id: 'kb-33', title: 'Checklist Instalação Portáteis Alunos (Mac)', content: 'Checklist\nhost:\norigem:\ndestino:\n- [ ] Connect Wifi UE-Students 5008888\n- [ ] ATUALIZE O SISTEMA PARA O MAC OSX SEQUOIA\n- [ ] REMOVE A PASTA AUTODESK\n- [ ] FAÇA O DOWNOAD DO INSTALADOR DO AUTOCAD NO SITE AUTODESK (LOGIN: ithelpdesk@universidadeeuropeia.pt, Palavra passe: padrao ow...354) CLIQUE EM TRUST THIS DEVICE, MENU, PRODUCTS E SERVICES, AUTOCAD FOR MAC, DOWNLOAD EM INGLES.\n- [ ] INSTALE NORMALMENTE O AUTOCAD.\n- [ ] LIMPE OS DADOS LOCAIS DO UTILIZADOR ALUNO (SECRETARIA, DOCUMENTOS, IMAGEM, LIXO)\n- [ ] ATUALIZE O BLENDER\n- [ ] ATUALIZE AS APLICAÇÕES ADOBE CREATIVE CLOUD.', category: 'Procedimentos e Checklists' },
      { id: 'kb-34', title: 'Fluxo Atendimento - Aluno não acede à aula', content: '- Entrar no Teams, logar com a conta da universidade.\n- Entrar no Canvas, verificar gravação.\n- Pode haver do professor não adicionar o aluno ao grupo ou algum erro nesse sentido, portanto o professor ou gestor académico deve ser contactado.', category: 'Fluxos de Atendimento' },
      { id: 'kb-35', title: 'Fluxo Atendimento - Esqueceu/Expirou Password', content: '1. Aceda a password.europeia.pt\n2. Clicar em "Esqueci password"\n3. Selecionar o perfil docente/estudante ou staff\n4. Digitar o número de docente/estudante\n5. Receber código por email ou SMS\n6. Digitar o código\n7. Redefinir palavra-passe\n8. Pronto, entrará agora no portal do estudante, Canvas, Teams, email, etc.\n*Caso aluno estiver com a conta bloqueada por excesso de tentativas: entrar como PWM Admin e desbloquear a conta.', category: 'Fluxos de Atendimento' },
      { id: 'kb-36', title: 'Fluxo Atendimento - Problemas Login Wi-Fi', content: 'Acesso Wi-Fi no campus é efetuado através das seguintes redes:\n- Docentes: ligue-se à rede UE-Faculty com as credenciais do Canvas.\n- Alunos: Ligue-se à rede UE-Students com as credenciais do Canvas.\n- Staff: ligue-se à rede UE-Employees com as credenciais que acede seu computador.\n- Convidados: ligue-se à rede UE-Events com a pass: UE-PT-Ev3.2025', category: 'Fluxos de Atendimento' },
      { id: 'kb-37', title: 'Fluxo Atendimento - Problemas Login Email', content: '- Verificar no 112 se há bloqueio, PWM, Canvas.\n- Caso não haver nada no 112, verificar se é aluno novo, 24 horas para fazer a integração do aluno ao sistema. Encaminhar para serviços académicos.', category: 'Fluxos de Atendimento' },
      { id: 'kb-38', title: 'Fluxo Atendimento - Problemas ServiceNow', content: 'Verificar erro, verificar link correto, PWM. Caso o dispositivo é diferente do registrado inicialmente, fazer reset do SSO.', category: 'Fluxos de Atendimento' },
      { id: 'kb-39', title: 'Fluxo Atendimento - Problemas HyFlex', content: 'Ligar para receção, linha de atendimento do IT. Para SmartMirror: abrir a tela do Android no HyFlex no botão Home ou selecionar o canal "Android", abrir o app SmartMirror, entrar em https://www.smartmirror.link/, digitar o código da ID da sessão, aceitar a reunião no HyFlex.', category: 'Fluxos de Atendimento' },
      { id: 'kb-40', title: 'Fluxo Atendimento - MAXQDA', content: 'Dentro do Canvas: menu lateral Comunidades, Recursos IT, INSTALAR CONFORME AS INSTRUÇÕES. SERVIDOR: 172.23.66.5:8443. *INSTALAR O VPN PARA ABRIR O SERVIDOR DE LICENÇAS DE FORA DA UNIVERSIDADE*', category: 'Fluxos de Atendimento' },
      { id: 'kb-41', title: 'Fluxo Atendimento - SPSS', content: 'Dentro do Canvas: menu lateral Comunidades, Recursos IT, IBM SPSS Instalação do Windows. Caso seja AMOS SPSS, deve-se abrir um ticket (Professor Vitor Augusto).', category: 'Fluxos de Atendimento' },
      { id: 'kb-42', title: 'Fluxo Atendimento - Adobe', content: 'Ver no site da Adobe Creative Cloud. Somente alunos com cursos associados, professores devem solicitar os acessos ao IT pelo ServiceNow.', category: 'Fluxos de Atendimento' },
      { id: 'kb-43', title: 'Fluxo Atendimento - AutoCAD', content: 'Ver no site da Autodesk, pois é um software terceiro onde os alunos registram como estudante para obter a licença estudante.', category: 'Fluxos de Atendimento' },
      { id: 'kb-44', title: 'Informações Permanentes', content: 'Primeira utilização de impressora: autenticação manual 2x, cartão 3a vez. Wi-Fi Docentes: rede Faculty, acesso Canvas. Wi-Fi Roteador Vodafone: UNIVERSIDADE_EUROPEIA, pass: Europeia2025. Wi-Fi UE-EVENTS: UE-Ev3.2025. IP servidor impressão: 172.26.2.12. CMD forçar domínio: gpupdate /force.', category: 'Informações Gerais' },
      { id: 'kb-45', title: 'Plataforma Exam.net - Provas Online', content: 'Para provas dos alunos do ensino online. Devem instalar a aplicação SafeBrowser da comunidade Respondus. Conteúdo disponível no email enviado pela admissions@universidadeeuropeia.pt ou admissions@iade.pt. Validação e dúvidas uma semana antes via Teams. No dia da prova, aluno abre Teams no telemóvel para dúvidas, realiza prova no computador enquanto fiscal monitora na reunião Teams no telemóvel. Monitorar validação e prova na data marcada e responder alunos via chat usando Teams (Email: suporte.helpdesk.portugal@universidadeeuropeia.pt, Password: Kaq35571).', category: 'Sistemas Académicos (Canvas, Exam.net)' },
    ];
    saveArticles(articles);
  }
};

const initializeBlogPosts = () => {
  let posts: BlogPost[] = getBlogPosts();
  if (posts.length === 0) {
    posts = [
      {
        id: 'blog-1',
        title: 'Nova Funcionalidade: Painel Kanban de Tarefas!',
        content: 'Estamos entusiasmados em anunciar o lançamento do nosso novo painel Kanban de tarefas, que permite gerenciar seus tickets de suporte de forma mais visual e eficiente. Arraste e solte tarefas entre as colunas "Inbox", "A Fazer", "Em Progresso" e "Concluído".',
        author: 'Equipa de Desenvolvimento',
        publishedAt: new Date(Date.now() - 86400000 * 3), // 3 dias atrás
      },
      {
        id: 'blog-2',
        title: 'Atualização da Base de Conhecimento',
        content: 'Adicionamos mais de 20 novos artigos à nossa Base de Conhecimento, cobrindo tópicos como configuração de Wi-Fi para alunos, resolução de problemas de acesso ao Canvas e guias para software académico como AutoCAD e MAXQDA.',
        author: 'Admin',
        publishedAt: new Date(Date.now() - 86400000 * 7), // 7 dias atrás
      },
      {
        id: 'blog-3',
        title: 'Melhorias na Performance do Sistema',
        content: 'Implementamos otimizações significativas no backend e frontend para garantir uma experiência mais rápida e responsiva em todas as áreas da aplicação.',
        author: 'Equipa de Desenvolvimento',
        publishedAt: new Date(Date.now() - 86400000 * 14), // 14 dias atrás
      },
    ];
    saveBlogPosts(posts);
  }
};


// Chamar initializeArticles e initializeBlogPosts uma vez quando o módulo é carregado
initializeArticles();
initializeBlogPosts();

// --- Notification API (for floating menu) ---
export interface AppNotification {
  id: string;
  message: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  link?: string; // Optional link for navigation
}

const getNotifications = (): AppNotification[] => {
  const storedNotifications = localStorage.getItem('appNotifications');
  return storedNotifications ? JSON.parse(storedNotifications).map((n: any) => ({
    ...n,
    timestamp: new Date(n.timestamp),
  })) : [];
};

const saveNotifications = (notifications: AppNotification[]) => {
  localStorage.setItem('appNotifications', JSON.stringify(notifications));
};

export const apiGetNotifications = (): AppNotification[] => {
  return getNotifications();
};

export const apiAddNotification = (notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification => {
  const currentNotifications = getNotifications();
  const newNotification: AppNotification = {
    ...notificationData,
    id: `notif-${Date.now()}`,
    timestamp: new Date(),
    read: false,
  };
  saveNotifications([newNotification, ...currentNotifications]); // Add new to top
  return newNotification;
};

export const apiMarkNotificationAsRead = (notificationId: string) => {
  const currentNotifications = getNotifications();
  const updatedNotifications = currentNotifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(updatedNotifications);
};

export const apiDeleteNotification = (notificationId: string) => {
  const currentNotifications = getNotifications();
  const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
  saveNotifications(updatedNotifications);
};
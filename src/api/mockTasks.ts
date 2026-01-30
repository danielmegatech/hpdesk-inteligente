import { Task, TaskStatus } from '@/components/TaskForm';
// import { supabase } from '@/integrations/supabase/client'; // Removido o import real do supabase
import { format } from 'date-fns';

const MOCK_USER_ID = 'mock-user-id-123'; // ID do utilizador mock

// Helper para obter tarefas do localStorage
const getMockTasks = (userId: string): Task[] => {
  const storedTasks = localStorage.getItem(`mockTasks_${userId}`);
  if (storedTasks) {
    return JSON.parse(storedTasks).map((task: any) => ({
      ...task,
      deadline: task.deadline ? new Date(task.deadline) : undefined,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      deletedAt: task.deletedAt ? new Date(task.deletedAt) : undefined, // Adicionado deletedAt
    }));
  }
  return [];
};

// Helper para salvar tarefas no localStorage
const saveMockTasks = (userId: string, tasks: Task[]) => {
  localStorage.setItem(`mockTasks_${userId}`, JSON.stringify(tasks));
};

// --- API de Tarefas usando Mock (localStorage) ---

export const apiGetTasks = async (userId: string = MOCK_USER_ID): Promise<Task[]> => {
  const allTasks = getMockTasks(userId);
  return allTasks.filter(task => !task.deletedAt).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const apiGetTrashedTasks = async (userId: string = MOCK_USER_ID): Promise<Task[]> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const allTasks = getMockTasks(userId);
  return allTasks.filter(task => task.deletedAt && new Date(task.deletedAt).getTime() >= thirtyDaysAgo.getTime())
                 .sort((a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime());
};

export const apiAddTask = async (newTaskData: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt' | 'deletedAt'>, userId: string = MOCK_USER_ID): Promise<Task | null> => {
  const currentTasks = getMockTasks(userId);
  const now = new Date();
  const newTask: Task = {
    ...newTaskData,
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // ID único
    status: newTaskData.status || 'pendente',
    priority: newTaskData.priority || 'Média',
    hoursSpent: newTaskData.hoursSpent || 0,
    estimatedHours: newTaskData.estimatedHours || 0,
    assignee: newTaskData.assignee || 'Não Atribuído',
    createdAt: now,
    updatedAt: now,
    history: [{ status: newTaskData.status || 'pendente', timestamp: now }],
  };
  saveMockTasks(userId, [newTask, ...currentTasks]);
  return newTask;
};

export const apiUpdateTask = async (updatedTaskData: Task, userId: string = MOCK_USER_ID): Promise<Task | null> => {
  const currentTasks = getMockTasks(userId);
  const now = new Date();
  let updatedTask: Task | null = null;

  const newTasks = currentTasks.map(task => {
    if (task.id === updatedTaskData.id) {
      const newHistory = [...task.history];
      if (task.status !== updatedTaskData.status) {
        newHistory.push({ status: updatedTaskData.status, timestamp: now });
      }
      updatedTask = {
        ...task,
        ...updatedTaskData,
        updatedAt: now,
        completedAt: updatedTaskData.status === 'concluido' ? now : undefined,
        deletedAt: updatedTaskData.status === 'lixeira' ? now : undefined,
        history: newHistory,
      };
      return updatedTask;
    }
    return task;
  });
  saveMockTasks(userId, newTasks);
  return updatedTask;
};

export const apiDeleteTask = async (taskId: string, userId: string = MOCK_USER_ID): Promise<void> => {
  const currentTasks = getMockTasks(userId);
  const now = new Date();
  const newTasks: Task[] = currentTasks.map(task => { // Explicitly type newTasks as Task[]
    if (task.id === taskId) {
      return { ...task, status: 'lixeira', deletedAt: now, updatedAt: now };
    }
    return task;
  });
  saveMockTasks(userId, newTasks);
};

export const apiRestoreTask = async (taskId: string, userId: string = MOCK_USER_ID): Promise<void> => {
  const currentTasks = getMockTasks(userId);
  const now = new Date();
  const newTasks: Task[] = currentTasks.map(task => { // Explicitly type newTasks as Task[]
    if (task.id === taskId) {
      return { ...task, status: 'pendente', deletedAt: undefined, updatedAt: now };
    }
    return task;
  });
  saveMockTasks(userId, newTasks);
};

export const apiPermanentDeleteTask = async (taskId: string, userId: string = MOCK_USER_ID): Promise<void> => {
  const currentTasks = getMockTasks(userId);
  const newTasks = currentTasks.filter(task => task.id !== taskId);
  saveMockTasks(userId, newTasks);
};

// Inicializar algumas tarefas mock se o localStorage estiver vazio
(() => {
  const userId = MOCK_USER_ID;
  if (getMockTasks(userId).length === 0) {
    const initialTasks: Task[] = [
      {
        id: 'task-mock-1',
        title: 'Configurar VPN para novo colaborador',
        description: 'Instalar e configurar o cliente VPN Cisco AnyConnect no portátil do novo colaborador.',
        deadline: new Date(Date.now() + 86400000 * 2), // Daqui a 2 dias
        location: 'Escritório OGC',
        time: '10:00',
        priority: 'Alta',
        status: 'a_fazer',
        hoursSpent: 0,
        estimatedHours: 2,
        assignee: 'Técnico A',
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000 * 5),
        history: [{ status: 'a_fazer', timestamp: new Date(Date.now() - 86400000 * 5) }],
      },
      {
        id: 'task-mock-2',
        title: 'Verificar lentidão na rede do 3º andar',
        description: 'Investigar relatos de lentidão na rede na área do 3º andar. Verificar switches e pontos de acesso.',
        deadline: new Date(Date.now() + 86400000 * 1), // Amanhã
        location: '3º Andar',
        time: '14:00',
        priority: 'Média',
        status: 'emProgresso',
        hoursSpent: 1,
        estimatedHours: 3,
        assignee: 'Técnico B',
        createdAt: new Date(Date.now() - 86400000 * 3),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        history: [
          { status: 'a_fazer', timestamp: new Date(Date.now() - 86400000 * 3) },
          { status: 'emProgresso', timestamp: new Date(Date.now() - 86400000 * 2) },
        ],
      },
      {
        id: 'task-mock-3',
        title: 'Atualizar software de gestão de inventário',
        description: 'Agendar e executar a atualização do software de gestão de inventário para a versão mais recente.',
        deadline: new Date(Date.now() + 86400000 * 7), // Daqui a 1 semana
        location: 'Servidor Central',
        time: '09:00',
        priority: 'Baixa',
        status: 'pendente',
        hoursSpent: 0,
        estimatedHours: 4,
        assignee: 'Técnico A',
        createdAt: new Date(Date.now() - 86400000 * 10),
        updatedAt: new Date(Date.now() - 86400000 * 10),
        history: [{ status: 'pendente', timestamp: new Date(Date.now() - 86400000 * 10) }],
      },
      {
        id: 'task-mock-4',
        title: 'Substituir monitor avariado na sala 201',
        description: 'O monitor da sala 201 não liga. Substituir por um novo e descartar o antigo.',
        deadline: new Date(Date.now() - 86400000 * 1), // Ontem (atrasado)
        location: 'Sala 201',
        time: '11:00',
        priority: 'Alta',
        status: 'a_fazer',
        hoursSpent: 0,
        estimatedHours: 1,
        assignee: 'Técnico C',
        createdAt: new Date(Date.now() - 86400000 * 4),
        updatedAt: new Date(Date.now() - 86400000 * 4),
        history: [{ status: 'a_fazer', timestamp: new Date(Date.now() - 86400000 * 4) }],
      },
      {
        id: 'task-mock-5',
        title: 'Reunião de planeamento de projetos de TI',
        description: 'Reunião semanal para discutir o progresso dos projetos atuais e planear as próximas fases.',
        deadline: new Date(Date.now() + 86400000 * 3), // Daqui a 3 dias
        location: 'Sala de Reuniões',
        time: '15:00',
        priority: 'Média',
        status: 'pendente',
        hoursSpent: 0,
        estimatedHours: 1,
        assignee: 'Técnico A',
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        history: [{ status: 'pendente', timestamp: new Date(Date.now() - 86400000 * 2) }],
      },
      {
        id: 'task-mock-6',
        title: 'Limpeza de cache do servidor web',
        description: 'Limpar a cache do servidor web para garantir que as últimas atualizações do site sejam visíveis.',
        deadline: new Date(Date.now() - 86400000 * 10), // Há 10 dias (concluído)
        location: 'Servidor Web',
        time: '03:00',
        priority: 'Baixa',
        status: 'concluido',
        hoursSpent: 0.5,
        estimatedHours: 0.5,
        assignee: 'Técnico B',
        createdAt: new Date(Date.now() - 86400000 * 12),
        updatedAt: new Date(Date.now() - 86400000 * 10),
        completedAt: new Date(Date.now() - 86400000 * 10),
        history: [
          { status: 'pendente', timestamp: new Date(Date.now() - 86400000 * 12) },
          { status: 'concluido', timestamp: new Date(Date.now() - 86400000 * 10) },
        ],
      },
      {
        id: 'task-mock-7',
        title: 'Tarefa na lixeira (exemplo)',
        description: 'Esta tarefa foi movida para a lixeira e será eliminada permanentemente após 30 dias.',
        deadline: new Date(Date.now() - 86400000 * 20),
        location: 'N/A',
        time: '12:00',
        priority: 'Baixa',
        status: 'lixeira',
        hoursSpent: 0,
        estimatedHours: 0,
        assignee: 'Técnico A',
        createdAt: new Date(Date.now() - 86400000 * 25),
        updatedAt: new Date(Date.now() - 86400000 * 20),
        deletedAt: new Date(Date.now() - 86400000 * 20),
        history: [
          { status: 'pendente', timestamp: new Date(Date.now() - 86400000 * 25) },
          { status: 'lixeira', timestamp: new Date(Date.now() - 86400000 * 20) },
        ],
      },
    ];
    saveMockTasks(userId, initialTasks);
  }
})();
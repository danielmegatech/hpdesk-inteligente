import { Task } from '@/components/TaskForm';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Helper to convert Supabase data to Task type
const mapSupabaseTaskToAppTask = (supabaseTask: any): Task => ({
  id: supabaseTask.id,
  title: supabaseTask.title,
  description: supabaseTask.description || '',
  deadline: supabaseTask.deadline ? new Date(supabaseTask.deadline) : undefined,
  location: supabaseTask.location || '',
  time: supabaseTask.time || '',
  status: supabaseTask.status,
  priority: supabaseTask.priority || 'Média',
  createdAt: new Date(supabaseTask.created_at),
  updatedAt: new Date(supabaseTask.updated_at),
  completedAt: supabaseTask.completed_at ? new Date(supabaseTask.completed_at) : undefined,
  history: [], // History will be managed separately or derived if needed for full audit
});

// --- Task API using Supabase ---
// Note: We assume RLS is set up to allow users to only see their own tasks, 
// but we explicitly filter by user_id for clarity and future multi-user support.

export const apiGetTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId) // Filter by current user
    .is('deleted_at', null) // Only get tasks not in trash
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data.map(mapSupabaseTaskToAppTask);
};

export const apiGetTrashedTasks = async (userId: string): Promise<Task[]> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId) // Filter by current user
    .not('deleted_at', 'is', null) // Only get tasks in trash
    .gte('deleted_at', thirtyDaysAgo.toISOString()) // Within the last 30 days
    .order('deleted_at', { ascending: false });

  if (error) {
    console.error('Error fetching trashed tasks:', error);
    return [];
  }
  return data.map(mapSupabaseTaskToAppTask);
};

export const apiAddTask = async (newTaskData: Omit<Task, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'completedAt'>, userId: string): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: newTaskData.title,
      description: newTaskData.description,
      deadline: newTaskData.deadline?.toISOString(),
      location: newTaskData.location,
      time: newTaskData.time,
      status: newTaskData.status,
      priority: newTaskData.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: userId, // Set user ID
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding task:', error);
    return null;
  }
  return mapSupabaseTaskToAppTask(data);
};

export const apiUpdateTask = async (updatedTaskData: Task): Promise<Task | null> => {
  // Note: RLS should prevent users from updating tasks they don't own.
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: updatedTaskData.title,
      description: updatedTaskData.description,
      deadline: updatedTaskData.deadline?.toISOString(),
      location: updatedTaskData.location,
      time: updatedTaskData.time,
      status: updatedTaskData.status,
      priority: updatedTaskData.priority,
      updated_at: new Date().toISOString(),
      completed_at: updatedTaskData.status === 'concluido' ? new Date().toISOString() : null,
      deleted_at: updatedTaskData.status === 'lixeira' ? new Date().toISOString() : null, // Set deleted_at if moving to trash
    })
    .eq('id', updatedTaskData.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }
  return mapSupabaseTaskToAppTask(data);
};

export const apiDeleteTask = async (taskId: string): Promise<void> => {
  // This now moves to trash by updating status and deleted_at
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'lixeira',
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error moving task to trash:', error);
  }
};

export const apiRestoreTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'novo', // Or previous status if stored
      deleted_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error restoring task:', error);
  }
};

export const apiPermanentDeleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error permanently deleting task:', error);
  }
};
import { AppNotification, apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle, apiGetReportMetrics, apiAddNotification, apiMarkNotificationAsRead, apiDeleteNotification, apiGetNotifications } from './mockApi';
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetTrashedTasks, apiRestoreTask, apiPermanentDeleteTask } from './supabaseTasks';

export type { AppNotification };
export { 
  apiGetTasks, 
  apiAddTask, 
  apiUpdateTask, 
  apiDeleteTask, 
  apiGetTrashedTasks, 
  apiRestoreTask, 
  apiPermanentDeleteTask,
  apiGetArticles, 
  apiAddArticle, 
  apiUpdateArticle, 
  apiDeleteArticle, 
  apiGetReportMetrics, 
  apiAddNotification, 
  apiMarkNotificationAsRead, 
  apiDeleteNotification, 
  apiGetNotifications 
};
import { AppNotification, apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle, apiAddNotification, apiMarkNotificationAsRead, apiDeleteNotification, apiGetNotifications } from './mockApi';
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetTrashedTasks, apiRestoreTask, apiPermanentDeleteTask } from './supabaseTasks';
import { apiGetReportMetrics, apiGetAuditLog } from './supabaseReports'; // Import from new reports file

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
  apiGetNotifications,
  apiGetAuditLog // Export new audit log API
};
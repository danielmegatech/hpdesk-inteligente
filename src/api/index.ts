import { AppNotification, apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle, apiAddNotification, apiMarkNotificationAsRead, apiDeleteNotification, apiGetNotifications } from './mockApi';
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetTrashedTasks, apiRestoreTask, apiPermanentDeleteTask } from './supabaseTasks'; // Removido .ts
import { apiGetReportMetrics, apiGetAuditLog, apiGetResolutionChartData } from './supabaseReports'; // Import from new reports file

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
  apiGetAuditLog,
  apiGetResolutionChartData // Export new chart data API
};
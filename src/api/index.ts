import { AppNotification, apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle, apiAddNotification, apiMarkNotificationAsRead, apiDeleteNotification, apiGetNotifications, apiGetBlogPosts, apiAddBlogPost, apiUpdateBlogPost, apiDeleteBlogPost } from './mockApi';
import { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetTrashedTasks, apiRestoreTask, apiPermanentDeleteTask } from './mockTasks';
import { apiGetReportMetrics, apiGetAuditLog, apiGetResolutionChartData } from './supabaseReports';

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
  apiGetResolutionChartData,
  apiGetBlogPosts, // Exportar novas funções de blog
  apiAddBlogPost,
  apiUpdateBlogPost,
  apiDeleteBlogPost
};
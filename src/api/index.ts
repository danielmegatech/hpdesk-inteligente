import { AppNotification, apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle, apiGetReportMetrics, apiAddNotification, apiMarkNotificationAsRead, apiDeleteNotification } from './mockApi';

export type { AppNotification }; // Re-exportar o tipo separadamente
export { apiGetTasks, apiAddTask, apiUpdateTask, apiDeleteTask, apiGetArticles, apiAddArticle, apiUpdateArticle, apiDeleteArticle, apiGetReportMetrics, apiAddNotification, apiMarkNotificationAsRead, apiDeleteNotification }; // Re-exportar os valores
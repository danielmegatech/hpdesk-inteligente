import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/Service";
import MainLayout from "./components/MainLayout";
import TasksPage from "./pages/Tasks";
import ReportsPage from "./pages/Reports";
import KnowledgeBasePage from "./pages/KnowledgeBase";
import SettingsPage from "./pages/Settings";
import { ThemeProvider } from "./components/ThemeProvider";
import { SessionContextProvider } from "./components/SessionContextProvider";
import Login from "./pages/Login";
import FlowsPage from "./pages/Flows";
import FlowManagementPage from "./pages/FlowManagement"; // Nova importação
import BlogPage from "./pages/BlogPage"; // Nova importação

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<ServicePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/kb" element={<KnowledgeBasePage />} />
                <Route path="/flows" element={<FlowsPage />} />
                <Route path="/flow-management" element={<FlowManagementPage />} /> {/* Nova rota */}
                <Route path="/blog" element={<BlogPage />} /> {/* Nova rota */}
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
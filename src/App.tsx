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
import { SessionContextProvider } from "./components/SessionContextProvider"; // Import SessionContextProvider
import Login from "./pages/Login"; // Import Login page
import FlowsPage from "./pages/Flows";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider> {/* Wrap everything that needs session/routing */}
            <Routes>
              {/* Temporarily remove the Login route and make MainLayout the default */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<ServicePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/kb" element={<KnowledgeBasePage />} />
                <Route path="/flows" element={<FlowsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="/login" element={<Login />} /> {/* Keep login page accessible if needed */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
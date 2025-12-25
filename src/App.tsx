import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import AboutAdmin from "./pages/admin/AboutAdmin";
import SkillsAdmin from "./pages/admin/SkillsAdmin";
import ExperienceAdmin from "./pages/admin/ExperienceAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><ProjectsAdmin /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/about" element={<ProtectedRoute><AdminLayout><AboutAdmin /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/skills" element={<ProtectedRoute><AdminLayout><SkillsAdmin /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/experience" element={<ProtectedRoute><AdminLayout><ExperienceAdmin /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/contact" element={<ProtectedRoute><AdminLayout><ContactAdmin /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute><AdminLayout><MessagesAdmin /></AdminLayout></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

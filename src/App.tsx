import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { DataProvider } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import PengawasanForm from "./pages/PengawasanForm";
import Riwayat from "./pages/Riwayat";
import DetailLaporan from "./pages/DetailLaporan";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Loader as Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DataProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pengawasan" element={<PengawasanForm />} />
          <Route path="/riwayat" element={<Riwayat />} />
          <Route path="/laporan/:id" element={<DetailLaporan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </DataProvider>
  );
}

function AuthRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<AuthRoute />} />
              <Route path="/*" element={<ProtectedRoutes />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DataProvider } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import PengawasanForm from "./pages/PengawasanForm";
import Riwayat from "./pages/Riwayat";
import DetailLaporan from "./pages/DetailLaporan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DataProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pengawasan" element={<PengawasanForm />} />
              <Route path="/riwayat" element={<Riwayat />} />
              <Route path="/laporan/:id" element={<DetailLaporan />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
      </DataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

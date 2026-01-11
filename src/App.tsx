import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profil from "./pages/Profil";
import ProgramPendidikan from "./pages/ProgramPendidikan";
import Ekstrakurikuler from "./pages/Ekstrakurikuler";
import HubungiKami from "./pages/HubungiKami";
import Pendaftaran from "./pages/Pendaftaran";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/program-pendidikan" element={<ProgramPendidikan />} />
          <Route path="/ekstrakurikuler" element={<Ekstrakurikuler />} />
          <Route path="/hubungi-kami" element={<HubungiKami />} />
          <Route path="/pendaftaran" element={<Pendaftaran />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

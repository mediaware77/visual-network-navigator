import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import RacksPage from "./pages/RacksPage";
import EquipmentPage from "./pages/EquipmentPage";
import PortMappingsPage from "./pages/PortMappingsPage";
import SearchPage from "./pages/SearchPage";
import DatabasePage from "./pages/DatabasePage";
import SettingsPage from "./pages/SettingsPage";
import NetworkInfoPage from "./pages/NetworkInfoPage"; // Importar a nova página
import NotFound from "./pages/NotFound";
import { PortInfoPage } from "./pages/PortInfoPage"; // Importar a nova página de informações da porta

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/racks" element={<RacksPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/port-mappings" element={<PortMappingsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/network_info" element={<NetworkInfoPage />} />
          <Route path="/port-info/:patchPanelId/:portNumber" element={<PortInfoPage />} /> {/* Rota para a página de informações da porta */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Usando a configuração carregada dinamicamente pelo config-loader.js
// em vez de importar diretamente do arquivo config.ts
// import { PageConfig } from "./config";
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

// Importando o ConfigProvider e o botão de recarregar configuração
import { ConfigProvider } from "./components/ConfigProvider";
import { ReloadConfigButton } from "./components/ReloadConfigButton";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ConfigProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {window.PageConfig?.RacksPage === 'on' && <Route path="/racks" element={<RacksPage />} />}
              {window.PageConfig?.EquipmentPage === 'on' && <Route path="/equipment" element={<EquipmentPage />} />}
              {window.PageConfig?.PortMappingsPage === 'on' && <Route path="/port-mappings" element={<PortMappingsPage />} />}
              {window.PageConfig?.SearchPage === 'on' && <Route path="/search" element={<SearchPage />} />}
              {window.PageConfig?.DatabasePage === 'on' && <Route path="/database" element={<DatabasePage />} />}
              {window.PageConfig?.SettingsPage === 'on' && <Route path="/settings" element={<SettingsPage />} />}
              {window.PageConfig?.NetworkInfoPage === 'on' && <Route path="/network_info" element={<NetworkInfoPage />} />}
              {window.PageConfig?.PortInfoPage === 'on' && <Route path="/port-info/:patchPanelId/:portNumber" element={<PortInfoPage />} />} {/* Rota para a página de informações da porta */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Botão para recarregar a configuração manualmente */}
            <ReloadConfigButton />
          </BrowserRouter>
        </ConfigProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

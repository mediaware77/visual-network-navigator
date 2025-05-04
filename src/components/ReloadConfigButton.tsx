import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

/**
 * Botão para recarregar manualmente a configuração
 * Útil quando o usuário edita o arquivo config.js e quer ver as alterações imediatamente
 */
export const ReloadConfigButton: React.FC = () => {
  const handleReload = () => {
    if (window.loadConfig) {
      window.loadConfig().then(() => {
        // Força uma atualização da página para aplicar as novas configurações
        window.location.reload();
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReload}
      title="Recarregar configuração"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Recarregar Configuração
    </Button>
  );
};
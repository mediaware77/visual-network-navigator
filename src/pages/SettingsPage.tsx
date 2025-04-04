
import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
// Lucide icons removed, using Remix Icon classes now
import { toast } from "sonner";

const SettingsPage = () => {
  const [autoSave, setAutoSave] = React.useState(true);
  const [showPortTooltips, setShowPortTooltips] = React.useState(true);
  const [enableAnimations, setEnableAnimations] = React.useState(true);
  
  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    toast.success(`Salvamento automático ${checked ? 'ativado' : 'desativado'}`);
  };
  
  const handleShowPortTooltipsChange = (checked: boolean) => {
    setShowPortTooltips(checked);
    toast.success(`Dicas de porta ${checked ? 'ativadas' : 'desativadas'}`);
  };
  
  const handleEnableAnimationsChange = (checked: boolean) => {
    setEnableAnimations(checked);
    toast.success(`Animações ${checked ? 'ativadas' : 'desativadas'}`);
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Configurações</h1> {/* Added font-display */}
          <p className="text-muted-foreground">
            Gerencie as preferências e configurações da aplicação
          </p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="ri-settings-3-line h-5 w-5"></i>
              Configurações da Aplicação
            </CardTitle>
            <CardDescription>
              Personalize sua experiência com o Mapeador de Rede Visual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Salvar alterações automaticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Salvar automaticamente as alterações no banco de dados
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={handleAutoSaveChange}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="show-tooltips">Mostrar dicas de porta</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir dicas ao passar o mouse sobre as portas
                </p>
              </div>
              <Switch
                id="show-tooltips"
                checked={showPortTooltips}
                onCheckedChange={handleShowPortTooltipsChange}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="enable-animations">Ativar animações</Label>
                <p className="text-sm text-muted-foreground">
                  Usar animações para destaque e transições
                </p>
              </div>
              <Switch
                id="enable-animations"
                checked={enableAnimations}
                onCheckedChange={handleEnableAnimationsChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="ri-information-line h-5 w-5"></i>
              Sobre
            </CardTitle>
            <CardDescription>
              Informações sobre o Mapeador de Rede Visual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Mapeador de Rede Visual (VNM)</h3>
              <p className="text-sm text-muted-foreground">
                Versão 1.0.0
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-1">O que é o VNM?</h3>
              <p className="text-sm text-muted-foreground">
                O Mapeador de Rede Visual é uma ferramenta projetada para ajudar administradores de rede e técnicos a gerenciar e visualizar a infraestrutura de rede. Ele fornece uma representação visual de racks, patch panels e mapeamentos de porta, facilitando a localização de equipamentos físicos e pontos lógicos da rede.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-1">Recursos</h3>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>Representação visual de racks e equipamentos</li>
                <li>Gerenciamento de mapeamento de portas</li>
                <li>Busca por ponto lógico ou localização física</li>
                <li>Exportação e importação do banco de dados para backups</li>
                <li>Design responsivo para desktop e mobile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;

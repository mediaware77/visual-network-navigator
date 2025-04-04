
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removido initDatabase da importação
import { getRacks, Equipment, getEquipmentByRackId, PortMapping, getPortMappingsByPatchPanelId } from "@/lib/db";
import { Button } from "@/components/ui/button";
// Lucide icons removed, using Remix Icon classes now
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  // Removido estado isDbInitialized
  const [stats, setStats] = useState({
    racks: 0,
    equipment: 0,
    patchPanels: 0,
    switches: 0,
    portMappings: 0,
  });

  // Adicionado useEffect para carregar os dados ao montar
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => { // Tornar a função async
    try {
      // Usar await para chamadas assíncronas
      const racks = await getRacks();
      
      let equipment: Equipment[] = [];
      let portMappings: PortMapping[] = [];
      
      // Usar Promise.all para buscar equipamentos e mapeamentos em paralelo (melhora performance)
      await Promise.all(racks.map(async (rack) => {
        const rackEquipment = await getEquipmentByRackId(rack.id);
        equipment = [...equipment, ...rackEquipment];
        
        await Promise.all(rackEquipment.map(async (eq) => {
          if (eq.equipment_type === 'PATCH_PANEL') {
            const mappings = await getPortMappingsByPatchPanelId(eq.id);
            portMappings = [...portMappings, ...mappings];
          }
        })); // Adicionado ')' para fechar o map interno
      })); // Adicionado ')' para fechar o map externo
      
      setStats({
        racks: racks.length,
        equipment: equipment.length,
        patchPanels: equipment.filter(eq => eq.equipment_type === 'PATCH_PANEL').length,
        switches: equipment.filter(eq => eq.equipment_type === 'SWITCH').length,
        portMappings: portMappings.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Painel</h1> {/* Added font-display */}
          <p className="text-muted-foreground">
            Bem-vindo ao Mapeador de Rede Visual
          </p>
        </div>
      </div>
      
      {/* Removida renderização condicional baseada em isDbInitialized */}
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Racks
                </CardTitle>
                <i className="ri-server-line h-4 w-4 text-muted-foreground"></i>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.racks}</div>
                <p className="text-xs text-muted-foreground">
                  Racks de infraestrutura de rede
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Patch Panels {/* Mantido */}
                </CardTitle>
                <i className="ri-flow-chart h-4 w-4 text-muted-foreground"></i> {/* Changed icon */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.patchPanels}</div>
                <p className="text-xs text-muted-foreground">
                  Painéis de conectividade passiva
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Switches {/* Mantido */}
                </CardTitle>
                <i className="ri-flow-chart h-4 w-4 text-muted-foreground"></i> {/* Changed icon */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.switches}</div>
                <p className="text-xs text-muted-foreground">
                  Switches de rede ativos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mapeamentos de Portas
                </CardTitle>
                <i className="ri-route-line h-4 w-4 text-muted-foreground"></i>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.portMappings}</div>
                <p className="text-xs text-muted-foreground">
                  Pontos lógicos mapeados
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Navegação Rápida</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Link to="/racks">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Ver Racks</span>
                    <i className="ri-arrow-right-line h-4 w-4"></i>
                  </Button>
                </Link>
                <Link to="/equipment">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Gerenciar Equipamentos</span>
                    <i className="ri-arrow-right-line h-4 w-4"></i>
                  </Button>
                </Link>
                <Link to="/port-mappings">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Mapeamentos de Portas</span>
                    <i className="ri-arrow-right-line h-4 w-4"></i>
                  </Button>
                </Link>
                <Link to="/search">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Buscar</span>
                    <i className="ri-arrow-right-line h-4 w-4"></i>
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  O Mapeador de Rede Visual ajuda você a identificar pontos de rede e suas localizações físicas em sua infraestrutura. Navegue por racks, patch panels e mapeamentos de portas com facilidade.
                </p>
                
                <h4 className="font-semibold mb-2">Recursos Principais:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Representação visual de racks e patch panels</li>
                  <li>Mapeamento simples de porta para ponto lógico</li>
                  <li>Busca rápida por ID do ponto ou localização física</li>
                  <li>Documentação de rede centralizada</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        {/* Removido div extra */}
      </>
      {/* Removido bloco 'else' da renderização condicional */}
    </Layout>
  );
};

export default Index;

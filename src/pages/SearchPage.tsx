
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PortMappingDetail, Rack, getPortMappingByLogicalPoint, getPortMappingByPhysicalLocation, getRackById, getRacks } from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// Lucide icons removed, using Remix Icon classes now
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [logicalPointId, setLogicalPointId] = useState("");
  const [rackId, setRackId] = useState<string>("");
  const [panelIdentifier, setPanelIdentifier] = useState("");
  const [portNumber, setPortNumber] = useState("");
  
  const [logicalPointResult, setLogicalPointResult] = useState<PortMappingDetail | null>(null);
  const [physicalLocationResult, setPhysicalLocationResult] = useState<any | null>(null);
  
  const [racks, setRacks] = useState<Rack[]>([]);
  
  React.useEffect(() => {
    const loadRacks = async () => {
      try {
        const rackList = await getRacks();
        setRacks(rackList);
      } catch (err) {
        console.error("Error loading racks:", err);
        // Poderia adicionar um toast.error aqui se desejado
      }
    };
    loadRacks();
  }, []);
  
  // Corrigida a duplicação e adicionado async/await
  const handleLogicalPointSearch = async () => { 
    if (!logicalPointId.trim()) {
      toast.error("Por favor, insira um identificador de ponto lógico");
      return;
    }
    
    try {
      const result = await getPortMappingByLogicalPoint(logicalPointId);
      setLogicalPointResult(result);
      
      if (!result) {
        toast.error(`Nenhum mapeamento encontrado para o ponto lógico "${logicalPointId}"`);
      }
    } catch (err) {
      console.error("Error searching for logical point:", err);
      toast.error("Ocorreu um erro durante a busca");
    }
  };
  
  // Adicionado async/await
  const handlePhysicalLocationSearch = async () => { 
    if (!rackId || !panelIdentifier || !portNumber) {
      toast.error("Por favor, preencha todos os campos de localização física");
      return;
    }
    
    try {
      const rackIdNum = parseInt(rackId);
      const portNum = parseInt(portNumber);
      
      if (isNaN(portNum)) {
        toast.error("O número da porta deve ser um número válido");
        return;
      }
      
      const result = await getPortMappingByPhysicalLocation(rackIdNum, panelIdentifier, portNum);
      
      if (result) {
        const rack = await getRackById(rackIdNum);
        setPhysicalLocationResult({
          ...result,
          rack_name: rack?.name || `Rack ${rackIdNum}`,
          panel_identifier: panelIdentifier
        });
      } else {
        setPhysicalLocationResult(null);
        toast.error("Nenhum mapeamento encontrado para esta localização física");
      }
    } catch (err) {
      console.error("Error searching for physical location:", err);
      toast.error("Ocorreu um erro durante a busca");
    }
  };
  
  return (
    <Layout>
      {/* Responsive header layout: stack on small screens, row on larger screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          {/* Responsive heading size */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">Busca</h1> {/* Added font-display */}
          <p className="text-muted-foreground mt-1"> {/* Added margin-top for spacing */}
            Encontre pontos de rede por ID lógico ou localização física
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="logical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          {/* Alterado para mostrar ícone em mobile e ícone+texto em desktop */}
          <TabsTrigger value="logical" className="flex items-center gap-2" aria-label="Buscar por Ponto Lógico">
            <i className="ri-flow-chart h-4 w-4"></i> {/* Ícone representativo */}
            <span className="hidden sm:inline">Buscar por Ponto Lógico</span> {/* Texto visível a partir de sm */}
          </TabsTrigger>
          {/* Alterado para mostrar ícone em mobile e ícone+texto em desktop */}
          <TabsTrigger value="physical" className="flex items-center gap-2" aria-label="Buscar por Localização Física">
            <i className="ri-map-pin-line h-4 w-4"></i> {/* Ícone representativo */}
            <span className="hidden sm:inline">Buscar por Localização Física</span> {/* Texto visível a partir de sm */}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Encontrar Ponto Lógico</CardTitle>
              <CardDescription>
                Insira um identificador de ponto lógico para encontrar sua localização física
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="logicalPointId">Identificador do Ponto Lógico</Label>
                {/* Responsive input/button layout: stack on small, row on sm+ */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="logicalPointId"
                    key="logicalPointIdInput" // Add a stable key to potentially help mobile focus issues
                    placeholder="ex: 222"
                    value={logicalPointId}
                    onChange={(e) => setLogicalPointId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogicalPointSearch();
                      }
                    }}
                    className="flex-grow" // Allow input to grow
                  />
                  <Button onClick={handleLogicalPointSearch} className="w-full sm:w-auto"> {/* Full width on small */}
                    <i className="ri-search-line mr-2 h-4 w-4"></i>
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {logicalPointResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Busca</CardTitle>
                <CardDescription>
                  Localização física para o ponto lógico "{logicalPointResult.logical_point_identifier}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Responsive grid: 1 col on small, 2 cols on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Rack</Label> {/* Mantido */}
                    <p className="font-medium">{logicalPointResult.rack_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Patch Panel</Label> {/* Mantido */}
                    <p className="font-medium">{logicalPointResult.panel_identifier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Número da Porta</Label>
                    <p className="font-medium">{logicalPointResult.physical_port_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Descrição</Label>
                    <p className="font-medium">{logicalPointResult.description || "—"}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/racks`} state={{ 
                  highlightRack: logicalPointResult.rack_id,
                  highlightEquipment: logicalPointResult.patch_panel_id,
                  highlightPort: logicalPointResult.physical_port_number
                }}>
                  <Button variant="outline">
                    <i className="ri-server-line mr-2 h-4 w-4"></i>
                    Ver no Rack
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-4">
          <Card>
            <CardHeader>
              {/* Tamanho da fonte reduzido para hierarquia secundária */}
              <CardTitle className="text-xl">Encontrar por Localização Física</CardTitle>
              <CardDescription>
                Insira as informações de rack, patch panel e porta para encontrar o ponto lógico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="rackSelect">Rack</Label> {/* Mantido */}
                  <Select value={rackId} onValueChange={setRackId}>
                    <SelectTrigger id="rackSelect">
                      <SelectValue placeholder="Selecione o rack" />
                    </SelectTrigger>
                    <SelectContent>
                      {racks.map((rack) => (
                        <SelectItem key={rack.id} value={rack.id.toString()}>
                          {rack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="panelIdentifier">Identificador do Patch Panel</Label>
                  <Input
                    id="panelIdentifier"
                    placeholder="ex: PP-01"
                    value={panelIdentifier}
                    onChange={(e) => setPanelIdentifier(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="portNumber">Número da Porta</Label>
                  <Input
                    id="portNumber"
                    placeholder="ex: 15"
                    value={portNumber}
                    onChange={(e) => setPortNumber(e.target.value)}
                    type="number"
                    min="1"
                  />
                </div>
              </div>
              
              <Button onClick={handlePhysicalLocationSearch} className="w-full">
                <i className="ri-search-line mr-2 h-4 w-4"></i>
                Buscar
              </Button>
            </CardContent>
          </Card>
          
          {physicalLocationResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Busca</CardTitle>
                <CardDescription>
                  Ponto lógico para a localização física
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Responsive grid: 1 col on small, 2 cols on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">ID do Ponto Lógico</Label>
                    <p className="font-medium">{physicalLocationResult.logical_point_identifier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Descrição</Label>
                    <p className="font-medium">{physicalLocationResult.description || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">Localização Física</Label>
                    <p className="font-medium">
                      {physicalLocationResult.rack_name}, {physicalLocationResult.panel_identifier}, 
                      Porta {physicalLocationResult.physical_port_number}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SearchPage;

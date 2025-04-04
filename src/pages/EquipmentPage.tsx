
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Equipment, Rack, getEquipmentByRackId, getRacks } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentDialog } from "@/components/EquipmentDialog";
// Lucide icons removed, using Remix Icon classes now
import { EquipmentView } from "@/components/EquipmentView";

const EquipmentPage = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedRackId, setSelectedRackId] = useState<string>("");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    loadRacks();
  }, []);
  
  useEffect(() => {
    if (selectedRackId) {
      loadEquipment(parseInt(selectedRackId));
    } else {
      setEquipment([]);
    }
  }, [selectedRackId]);
  
  const loadRacks = async () => { // Tornar async
    try {
      const rackList = await getRacks(); // Usar await
      setRacks(rackList);
      
      if (rackList.length > 0 && !selectedRackId) {
        setSelectedRackId(rackList[0].id.toString());
      }
    } catch (err) {
      console.error("Error loading racks:", err);
    }
  };
  
  const loadEquipment = async (rackId: number) => { // Tornar async
    try {
      const equipmentList = await getEquipmentByRackId(rackId); // Usar await
      setEquipment(equipmentList);
    } catch (err) {
      console.error("Error loading equipment:", err);
    }
  };
  
  const handleAddEquipment = () => {
    setIsDialogOpen(true);
  };
  
  const handleEquipmentUpdate = () => {
    if (selectedRackId) {
      loadEquipment(parseInt(selectedRackId));
    }
  };
  
  const getSelectedRack = () => {
    return selectedRackId ? racks.find(r => r.id === parseInt(selectedRackId)) : null;
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Equipamentos</h1> {/* Added font-display */}
          <p className="text-muted-foreground">
            Gerencie patch panels e switches em seus racks
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecionar Rack</CardTitle>
          <CardDescription>
            Escolha um rack para visualizar e gerenciar seus equipamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-64">
            <Select
              value={selectedRackId}
              onValueChange={setSelectedRackId}
              disabled={racks.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um rack" />
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
          
          <Button 
            onClick={handleAddEquipment} 
            disabled={!selectedRackId}
          >
            <i className="ri-add-line mr-2 h-4 w-4"></i>
            Adicionar Equipamento
          </Button>
        </CardContent>
      </Card>
      
      {selectedRackId ? (
        <>
          {equipment.length > 0 ? (
            <div className="space-y-6">
              {equipment.map((eq) => (
                <EquipmentView 
                  key={eq.id} 
                  equipment={eq} 
                  onUpdate={handleEquipmentUpdate} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <i className="ri-hard-drive-2-line h-10 w-10 text-muted-foreground"></i>
                </div>
                <h2 className="mt-6 text-xl font-semibold">Nenhum equipamento encontrado</h2>
                <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
                  Este rack ainda não possui equipamentos. Adicione patch panels ou switches para começar.
                </p>
                <Button onClick={handleAddEquipment}>
                  <i className="ri-add-line mr-2 h-4 w-4"></i>
                  Adicionar Equipamento
                </Button>
              </CardContent>
            </Card>
          )}
          
          <EquipmentDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            rackId={parseInt(selectedRackId)}
            onSave={handleEquipmentUpdate}
          />
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <i className="ri-server-line h-10 w-10 text-muted-foreground"></i> {/* Changed icon */}
            </div>
            <h2 className="mt-6 text-xl font-semibold">Nenhum rack disponível</h2>
            <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
              Você precisa criar um rack antes de poder adicionar equipamentos. Vá para a página Racks para criar um.
            </p>
            <Button asChild>
              <a href="/racks">Ir para Racks</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default EquipmentPage;

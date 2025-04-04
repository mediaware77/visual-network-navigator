
import React, { useState } from "react";
import { Equipment, Rack, getEquipmentByRackId } from "@/lib/db";
import { EquipmentView } from "./EquipmentView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// Lucide icons removed, using Remix Icon classes now
import { RackDialog } from "./RackDialog";
import { EquipmentDialog } from "./EquipmentDialog";

interface RackViewProps {
  rack: Rack;
  onRackUpdate: () => void;
}

export function RackView({ rack, onRackUpdate }: RackViewProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isRackDialogOpen, setIsRackDialogOpen] = useState(false);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  
  React.useEffect(() => {
    loadEquipment();
  }, [rack.id]);
  
  const loadEquipment = async () => { // Tornar async
    try {
      const equipmentList = await getEquipmentByRackId(rack.id); // Usar await
      setEquipment(equipmentList);
    } catch (err) {
      console.error("Error loading equipment:", err);
    }
  };
  
  const handleAddEquipment = () => {
    setIsEquipmentDialogOpen(true);
  };
  
  const handleEditRack = () => {
    setIsRackDialogOpen(true);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-server-line h-5 w-5 text-primary"></i> {/* Changed color class */}
            <CardTitle>{rack.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddEquipment}>
              <i className="ri-hard-drive-2-line h-4 w-4 mr-2"></i>
              Adicionar Equipamento
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditRack}>
              <i className="ri-settings-3-line h-4 w-4 mr-2"></i>
              Editar Rack
            </Button>
          </div>
        </div>
        {rack.location && <CardDescription>{rack.location}</CardDescription>}
        {rack.description && <CardDescription>{rack.description}</CardDescription>}
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-4">
        <div className="rack-container">
          {equipment.length > 0 ? (
            equipment.map((eq) => (
              <EquipmentView 
                key={eq.id} 
                equipment={eq} 
                onUpdate={loadEquipment} 
              />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum equipamento neste rack ainda. Adicione equipamentos para começar.
            </div>
          )}
        </div>
      </CardContent>
      
      <RackDialog 
        open={isRackDialogOpen} 
        onOpenChange={setIsRackDialogOpen} 
        existingRack={rack}
        onSave={onRackUpdate}
      />
      
      <EquipmentDialog 
        open={isEquipmentDialogOpen} 
        onOpenChange={setIsEquipmentDialogOpen} 
        rackId={rack.id}
        onSave={loadEquipment}
      />
    </Card>
  );
}


import React, { useState } from "react";
import { Equipment, Rack, getEquipmentByRackId } from "@/lib/db";
import { EquipmentView } from "./EquipmentView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Server, ServerCog, Settings } from "lucide-react";
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
  
  const loadEquipment = () => {
    try {
      const equipmentList = getEquipmentByRackId(rack.id);
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
            <Server className="h-5 w-5 text-network-blue" />
            <CardTitle>{rack.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddEquipment}>
              <ServerCog className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditRack}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Rack
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
              No equipment in this rack yet. Add equipment to get started.
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

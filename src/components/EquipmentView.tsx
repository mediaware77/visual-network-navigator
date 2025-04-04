
import React, { useState, useEffect } from "react";
import { Equipment, PortMapping, getPortMappingsByPatchPanelId } from "@/lib/db";
import { PortGrid } from "./PortGrid";
import { Button } from "@/components/ui/button";
// Lucide icons removed, using Remix Icon classes now
import { PortMappingDialog } from "./PortMappingDialog";
import { EquipmentDialog } from "./EquipmentDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteEquipment } from "@/lib/db";
import { toast } from "sonner";

interface EquipmentViewProps {
  equipment: Equipment;
  onUpdate: () => void;
  highlightedPort?: {
    equipmentId: number;
    portNumber: number;
  } | null;
}

export function EquipmentView({ 
  equipment, 
  onUpdate,
  highlightedPort
}: EquipmentViewProps) {
  const [portMappings, setPortMappings] = useState<PortMapping[]>([]);
  const [isPortDialogOpen, setIsPortDialogOpen] = useState(false);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  
  useEffect(() => {
    if (equipment.equipment_type === 'PATCH_PANEL') {
      loadPortMappings();
    }
  }, [equipment.id]);
  
  const loadPortMappings = async () => { // Tornar async
    try {
      const mappings = await getPortMappingsByPatchPanelId(equipment.id); // Usar await
      setPortMappings(mappings);
    } catch (err) {
      console.error("Error loading port mappings:", err);
    }
  };
  
  const handlePortClick = (portNumber: number) => {
    if (equipment.equipment_type === 'PATCH_PANEL') {
      setSelectedPort(portNumber);
      setIsPortDialogOpen(true);
    }
  };
  
  const handleEdit = () => {
    setIsEquipmentDialogOpen(true);
  };
  
  const handleDelete = async () => { // Tornar async
    try {
      await deleteEquipment(equipment.id); // Usar await
      toast.success(`${equipment.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} excluído com sucesso`);
      onUpdate();
    } catch (err) {
      console.error("Error deleting equipment:", err);
      toast.error("Falha ao excluir equipamento");
    }
  };
  
  const getEquipmentTypeLabel = () => {
    return equipment.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'; // Mantido
  };
  
  const getPortCount = () => {
    return equipment.port_count || 24; // Default to 24 if not specified
  };
  
  return (
    <div className={`equipment ${equipment.equipment_type.toLowerCase()}`}>
      <div className="equipment-header">
        <div>
          {getEquipmentTypeLabel()} {equipment.identifier}
          {equipment.model && ` - ${equipment.model}`}
          {equipment.port_count && ` (${equipment.port_count} portas)`}
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleEdit}>
            <i className="ri-pencil-line h-3 w-3"></i>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <i className="ri-delete-bin-line h-3 w-3"></i>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso excluirá o {getEquipmentTypeLabel().toLowerCase()} e todos os mapeamentos de porta associados. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <PortGrid 
        portCount={getPortCount()}
        mappings={portMappings}
        onPortClick={handlePortClick}
        highlightPort={highlightedPort?.equipmentId === equipment.id ? highlightedPort.portNumber : undefined}
      />
      
      {equipment.equipment_type === 'PATCH_PANEL' && (
        <PortMappingDialog
          open={isPortDialogOpen}
          onOpenChange={setIsPortDialogOpen}
          patchPanelId={equipment.id}
          portNumber={selectedPort}
          existingMappings={portMappings}
          onSave={loadPortMappings}
        />
      )}
      
      <EquipmentDialog
        open={isEquipmentDialogOpen}
        onOpenChange={setIsEquipmentDialogOpen}
        rackId={equipment.rack_id}
        existingEquipment={equipment}
        onSave={onUpdate}
      />
    </div>
  );
}

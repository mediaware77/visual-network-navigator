
import React, { useState, useEffect } from "react";
import { Equipment, PortMapping, getPortMappingsByPatchPanelId } from "@/lib/db";
import { PortGrid } from "./PortGrid";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
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
  
  const loadPortMappings = () => {
    try {
      const mappings = getPortMappingsByPatchPanelId(equipment.id);
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
  
  const handleDelete = () => {
    try {
      deleteEquipment(equipment.id);
      toast.success(`${equipment.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} deleted successfully`);
      onUpdate();
    } catch (err) {
      console.error("Error deleting equipment:", err);
      toast.error("Failed to delete equipment");
    }
  };
  
  const getEquipmentTypeLabel = () => {
    return equipment.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch';
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
          {equipment.port_count && ` (${equipment.port_count} ports)`}
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Trash className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete the {getEquipmentTypeLabel().toLowerCase()} and all associated port mappings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
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

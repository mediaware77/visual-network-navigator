import React, { useState, useEffect } from "react";
import { Equipment, PortMapping, getPortMappingsByPatchPanelId } from "@/lib/db";
import { PortGrid } from "./PortGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Importar Link
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

  const loadPortMappings = async () => {
    try {
      const mappings = await getPortMappingsByPatchPanelId(equipment.id);
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

  const handleDelete = async () => {
    try {
      await deleteEquipment(equipment.id);
      toast.success(`${equipment.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} excluído com sucesso`);
      onUpdate();
    } catch (err) {
      console.error("Error deleting equipment:", err);
      toast.error("Falha ao excluir equipamento");
    }
  };

  const getEquipmentTypeLabel = () => {
    return equipment.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch';
  };

  const getPortCount = () => {
    return equipment.port_count || 24; // Default to 24 if not specified
  };

  return (
    <div
      className={`equipment ${equipment.equipment_type.toLowerCase()} ${
        equipment.equipment_type === 'PATCH_PANEL' || equipment.equipment_type === 'SWITCH'
          ? 'rounded-md'
          : ''
      }`}
    >
      <div
        className={`equipment-header text-white ${
          equipment.equipment_type === 'PATCH_PANEL'
            ? 'bg-gray-400' // Cinza mais claro
            : equipment.equipment_type === 'SWITCH'
            ? 'bg-orange-400' // Laranja mais escuro
            : 'bg-gray-600' // Cor padrão caso não seja nenhum dos tipos
        }`}
      >
        <div>
          {getEquipmentTypeLabel()} {equipment.identifier}
          {equipment.model && ` - ${equipment.model}`}
          {equipment.port_count && ` (${equipment.port_count} portas)`}
        </div>
        <div className="flex gap-1">
          {/* Botão Editar */}
          {/* Responsive button and icon size */}
          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-6 sm:w-6" onClick={handleEdit} title="Editar Equipamento">
            <i className="ri-pencil-line h-4 w-4 sm:h-3 sm:w-3"></i>
          </Button>
          {/* Botão QR Code */}
          {/* Responsive button and icon size */}
          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-6 sm:w-6" asChild title="Ver QR Code">
            <Link to={`/network_info?equipment_id=${equipment.id}`}>
              <i className="ri-qr-code-line h-4 w-4 sm:h-3 sm:w-3"></i>
            </Link>
          </Button>
          {/* Botão Excluir */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* Responsive button and icon size */}
              <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-6 sm:w-6" title="Excluir Equipamento">
                <i className="ri-delete-bin-line h-4 w-4 sm:h-3 sm:w-3"></i>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso excluirá o {getEquipmentTypeLabel().toLowerCase()} {equipment.identifier} e todos os mapeamentos de porta associados (se for um patch panel). Esta ação não pode ser desfeita.
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
        // equipmentId={equipment.id} // REMOVED - Prop no longer exists on PortGrid
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

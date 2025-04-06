
import React, { useState } from "react";
import { Equipment, Rack, getEquipmentByRackId, deleteRack } from "@/lib/db"; // Import deleteRack
import { EquipmentView } from "./EquipmentView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// Lucide icons removed, using Remix Icon classes now
import { RackDialog } from "./RackDialog";
import { EquipmentDialog } from "./EquipmentDialog";
import { ConfirmDeleteRackDialog } from "./ConfirmDeleteRackDialog.tsx"; // Importar o novo diálogo (added .tsx)
import { toast } from "sonner"; // Importar toast para notificações

interface RackViewProps {
  rack: Rack;
  onRackUpdate: () => void;
}

export function RackView({ rack, onRackUpdate }: RackViewProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isRackDialogOpen, setIsRackDialogOpen] = useState(false);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false); // Estado para o diálogo de confirmação
  
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
  
  const handleDeleteRackClick = () => {
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRack(rack.id);
      toast.success(`Rack "${rack.name}" excluído com sucesso.`);
      setIsConfirmDeleteDialogOpen(false);
      onRackUpdate(); // Atualiza a lista na página pai
    } catch (error) {
      console.error("Erro ao excluir rack:", error);
      // Verifica se o erro é a mensagem específica de "rack não vazio"
      // Se for, o toast.warning já foi exibido em db.ts, então não mostramos outro.
      if (!(error instanceof Error && error.message.startsWith("Este rack contém"))) {
        // Se for qualquer outro erro, mostra o toast genérico
        toast.error("Falha ao excluir o rack. Verifique o console para mais detalhes.");
      }
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        {/* Responsive header: stack on small, row on medium+ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <i className="ri-server-line h-5 w-5 text-primary"></i> {/* Changed color class */}
            {/* Responsive title size (using Card default for now, adjust if needed) */}
            <CardTitle>{rack.name}</CardTitle>
          </div>
          {/* Responsive buttons: icon only on xs, icon+text on sm+ */}
          <div className="flex gap-2 self-end sm:self-center"> {/* Align buttons right on small screens */}
            <Button variant="outline" size="sm" onClick={handleAddEquipment} className="h-8"> {/* Ensure consistent height */}
              <i className="ri-hard-drive-2-line h-4 w-4 sm:mr-2"></i> {/* Margin only on sm+ */}
              <span className="hidden sm:inline">Adicionar Equipamento</span> {/* Text hidden on xs */}
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditRack} className="h-8"> {/* Ensure consistent height */}
              <i className="ri-settings-3-line h-4 w-4 sm:mr-2"></i> {/* Margin only on sm+ */}
              <span className="hidden sm:inline">Editar Rack</span> {/* Text hidden on xs */}
            </Button>
            {/* Botão Remover Rack */}
            <Button variant="destructive" size="sm" onClick={handleDeleteRackClick} className="h-8"> {/* Ensure consistent height */}
              <i className="ri-delete-bin-line h-4 w-4 sm:mr-2"></i> {/* Margin only on sm+ */}
              <span className="hidden sm:inline">Remover Rack</span> {/* Text hidden on xs */}
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
      
      <ConfirmDeleteRackDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        rackName={rack.name}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}

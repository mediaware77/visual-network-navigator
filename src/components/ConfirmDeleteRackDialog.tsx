import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Import Button for the disabled state logic

interface ConfirmDeleteRackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rackName: string;
  onConfirm: () => void;
}

export function ConfirmDeleteRackDialog({
  open,
  onOpenChange,
  rackName,
  onConfirm,
}: ConfirmDeleteRackDialogProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);

  useEffect(() => {
    // Reset input when dialog opens or rackName changes
    if (open) {
      setConfirmationInput("");
    }
  }, [open, rackName]);

  useEffect(() => {
    // Enable delete button only if the input matches the rack name exactly
    setIsDeleteButtonEnabled(confirmationInput === rackName);
  }, [confirmationInput, rackName]);

  const handleConfirm = () => {
    if (isDeleteButtonEnabled) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão de Rack</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir permanentemente o rack "{rackName}"? 
            Esta ação não pode ser desfeita. Para confirmar, digite o nome exato do rack abaixo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2 py-4">
          <Label htmlFor="rack-name-confirmation">Nome do Rack</Label>
          <Input
            id="rack-name-confirmation"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={rackName} // Show the expected name as placeholder
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
          {/* Use Button component to control disabled state */}
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isDeleteButtonEnabled}
          >
            Excluir Rack
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
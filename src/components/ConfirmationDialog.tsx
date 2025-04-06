import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfirmationDialogProps {
  triggerButton: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmationText: string;
  confirmButtonLabel: string;
  onConfirm: () => void;
  confirmButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function ConfirmationDialog({
  triggerButton,
  title,
  description,
  confirmationText,
  confirmButtonLabel,
  onConfirm,
  confirmButtonVariant = 'default',
}: ConfirmationDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const isConfirmationMatch = inputValue === confirmationText;

  const handleConfirm = () => {
    if (isConfirmationMatch) {
      onConfirm();
      setIsOpen(false); // Fecha o modal após a confirmação
      setInputValue(''); // Limpa o input
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setInputValue(''); // Limpa o input ao fechar
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmation-input" className="col-span-4 text-sm font-medium">
              Para confirmar, digite: <span className="font-bold text-primary">{confirmationText}</span>
            </Label>
            <Input
              id="confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-4"
              autoComplete="off"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isConfirmationMatch}
            variant={confirmButtonVariant}
          >
            {confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
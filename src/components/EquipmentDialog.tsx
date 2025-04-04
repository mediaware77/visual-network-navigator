
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Equipment, createEquipment, updateEquipment } from "@/lib/db";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface EquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rackId: number;
  existingEquipment?: Equipment;
  onSave: () => void;
}

const formSchema = z.object({
  equipment_type: z.enum(['PATCH_PANEL', 'SWITCH']),
  identifier: z.string().min(1, "O identificador é obrigatório"),
  model: z.string().optional(),
  port_count: z.coerce.number().min(1, "A contagem de portas deve ser pelo menos 1").optional(),
  u_position: z.coerce.number().min(1, "A posição deve ser pelo menos 1").optional(),
  description: z.string().optional(),
});

export function EquipmentDialog({ 
  open, 
  onOpenChange, 
  rackId,
  existingEquipment,
  onSave 
}: EquipmentDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipment_type: existingEquipment?.equipment_type || 'PATCH_PANEL',
      identifier: existingEquipment?.identifier || "",
      model: existingEquipment?.model || "",
      port_count: existingEquipment?.port_count || 24,
      u_position: existingEquipment?.u_position || undefined,
      description: existingEquipment?.description || "",
    },
  });
  
  const isEditing = !!existingEquipment;
  
  React.useEffect(() => {
    if (open && existingEquipment) {
      form.reset({
        equipment_type: existingEquipment.equipment_type,
        identifier: existingEquipment.identifier,
        model: existingEquipment.model || "",
        port_count: existingEquipment.port_count || 24,
        u_position: existingEquipment.u_position,
        description: existingEquipment.description || "",
      });
    } else if (open) {
      form.reset({
        equipment_type: 'PATCH_PANEL',
        identifier: "",
        model: "",
        port_count: 24,
        u_position: undefined,
        description: "",
      });
    }
  }, [open, existingEquipment, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && existingEquipment) {
        await updateEquipment(existingEquipment.id, { ...values, rack_id: rackId });
        toast.success(`${values.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} atualizado com sucesso`);
      } else {
        // Explicitly cast to satisfy TypeScript, as 'values' guarantees the required fields
        await createEquipment({ ...values, rack_id: rackId } as Omit<Equipment, 'id'>);
        toast.success(`${values.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} criado com sucesso`);
      }

      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving equipment:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} equipamento: ${errorMessage}`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Editar ${existingEquipment?.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'}` : "Adicionar Equipamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os detalhes deste equipamento."
              : "Insira os detalhes para o novo equipamento do rack."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="equipment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Equipamento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-2 sm:gap-4" // Responsive layout: stack on small, row on sm+
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="PATCH_PANEL" 
                          id="patch_panel" 
                          checked={field.value === 'PATCH_PANEL'} 
                        />
                        <Label htmlFor="patch_panel">Patch Panel</Label> {/* Mantido */}
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="SWITCH" 
                          id="switch" 
                          checked={field.value === 'SWITCH'} 
                        />
                        <Label htmlFor="switch">Switch</Label> {/* Mantido */}
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: PP-01 ou SW-Core" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: CAT6 48-Portas ou Cisco 3850" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="port_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contagem de Portas</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      placeholder="ex: 24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="u_position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posição U (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      placeholder="ex: 1"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição opcional"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


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
  identifier: z.string().min(1, "Identifier is required"),
  model: z.string().optional(),
  port_count: z.coerce.number().min(1, "Port count must be at least 1").optional(),
  u_position: z.coerce.number().min(1, "Position must be at least 1").optional(),
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
        updateEquipment(existingEquipment.id, { ...values, rack_id: rackId });
        toast.success(`${values.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} updated successfully`);
      } else {
        createEquipment({ ...values, rack_id: rackId });
        toast.success(`${values.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'} created successfully`);
      }
      
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} equipment`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${existingEquipment?.equipment_type === 'PATCH_PANEL' ? 'Patch Panel' : 'Switch'}` : "Add Equipment"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details for this equipment." 
              : "Enter the details for new rack equipment."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="equipment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="PATCH_PANEL" 
                          id="patch_panel" 
                          checked={field.value === 'PATCH_PANEL'} 
                        />
                        <Label htmlFor="patch_panel">Patch Panel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="SWITCH" 
                          id="switch" 
                          checked={field.value === 'SWITCH'} 
                        />
                        <Label htmlFor="switch">Switch</Label>
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
                  <FormLabel>Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="PP-01 or SW-Core" {...field} />
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
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="CAT6 48-Port or Cisco 3850" {...field} />
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
                  <FormLabel>Port Count</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      placeholder="24" 
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
                  <FormLabel>U Position (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      placeholder="1" 
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

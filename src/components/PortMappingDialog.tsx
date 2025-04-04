
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
import { PortMapping, createPortMapping, deletePortMapping, updatePortMapping } from "@/lib/db";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PortMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patchPanelId: number;
  portNumber: number | null;
  existingMappings: PortMapping[];
  onSave: () => void;
}

const formSchema = z.object({
  logical_point_identifier: z.string().min(1, "Logical point identifier is required"),
  description: z.string().optional(),
});

export function PortMappingDialog({ 
  open, 
  onOpenChange, 
  patchPanelId,
  portNumber,
  existingMappings,
  onSave 
}: PortMappingDialogProps) {
  const existingMapping = portNumber 
    ? existingMappings.find(m => m.physical_port_number === portNumber) 
    : null;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logical_point_identifier: existingMapping?.logical_point_identifier || "",
      description: existingMapping?.description || "",
    },
  });
  
  React.useEffect(() => {
    if (open && existingMapping) {
      form.reset({
        logical_point_identifier: existingMapping.logical_point_identifier,
        description: existingMapping.description || "",
      });
    } else if (open) {
      form.reset({
        logical_point_identifier: "",
        description: "",
      });
    }
  }, [open, existingMapping, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!portNumber) {
      toast.error("No port selected");
      return;
    }
    
    try {
      if (existingMapping) {
        updatePortMapping(existingMapping.id, {
          ...values,
          patch_panel_id: patchPanelId,
          physical_port_number: portNumber,
        });
        toast.success("Port mapping updated successfully");
      } else {
        createPortMapping({
          ...values,
          patch_panel_id: patchPanelId,
          physical_port_number: portNumber,
        });
        toast.success("Port mapping created successfully");
      }
      
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving port mapping:", error);
      toast.error(`Failed to ${existingMapping ? 'update' : 'create'} port mapping`);
    }
  };
  
  const handleDelete = () => {
    if (!existingMapping) return;
    
    try {
      deletePortMapping(existingMapping.id);
      toast.success("Port mapping deleted successfully");
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error deleting port mapping:", error);
      toast.error("Failed to delete port mapping");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingMapping 
              ? `Edit Port ${portNumber} Mapping` 
              : `Map Port ${portNumber}`}
          </DialogTitle>
          <DialogDescription>
            {existingMapping 
              ? "Update the mapping for this port." 
              : "Create a new mapping for this port."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="logical_point_identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logical Point Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="222" {...field} />
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
                      placeholder="Reception desk" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2">
              {existingMapping && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      Remove Mapping
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the mapping for port {portNumber}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button type="submit">
                {existingMapping ? "Update" : "Map"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

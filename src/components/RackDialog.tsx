
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
import { Rack, createRack, updateRack } from "@/lib/db";
import { toast } from "sonner";

interface RackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingRack?: Rack;
  onSave: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Rack name is required"),
  location: z.string().optional(),
  description: z.string().optional(),
});

export function RackDialog({ 
  open, 
  onOpenChange, 
  existingRack,
  onSave 
}: RackDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingRack?.name || "",
      location: existingRack?.location || "",
      description: existingRack?.description || "",
    },
  });
  
  const isEditing = !!existingRack;
  
  React.useEffect(() => {
    if (open && existingRack) {
      form.reset({
        name: existingRack.name,
        location: existingRack.location || "",
        description: existingRack.description || "",
      });
    } else if (open) {
      form.reset({
        name: "",
        location: "",
        description: "",
      });
    }
  }, [open, existingRack, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && existingRack) {
        updateRack(existingRack.id, values);
        toast.success("Rack updated successfully");
      } else {
        createRack(values);
        toast.success("Rack created successfully");
      }
      
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving rack:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} rack`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Rack" : "Create Rack"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details for this rack." 
              : "Enter the details for a new rack."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Server Rack" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Data Center Floor 1" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional description of this rack" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

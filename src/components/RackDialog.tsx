
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
  name: z.string().min(1, "O nome do rack é obrigatório"),
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
        await updateRack(existingRack.id, values); // Adicionar await
        toast.success("Rack atualizado com sucesso");
      } else {
        // Usar asserção de tipo para garantir que 'name' está presente
        await createRack(values as Omit<Rack, 'id'>); 
        toast.success("Rack criado com sucesso");
      }
      
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving rack:", error);
      toast.error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} rack`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Rack" : "Criar Rack"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os detalhes deste rack."
              : "Insira os detalhes para um novo rack."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Rack Principal de Servidores" {...field} />
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
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Data Center Piso 1" {...field} />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição opcional deste rack"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

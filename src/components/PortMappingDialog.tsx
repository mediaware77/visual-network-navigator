
import React, { useRef } from "react"; // Add useRef
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas
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
  logical_point_identifier: z.string().min(1, "O identificador do ponto lógico é obrigatório"),
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

  const qrCodeRef = useRef<HTMLCanvasElement>(null); // Ref for the hidden QR Code
  
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
      toast.error("Nenhuma porta selecionada");
      return;
    }
    
    try {
      if (existingMapping) {
        await updatePortMapping(existingMapping.id, { // Adicionar await
          ...values,
          patch_panel_id: patchPanelId,
          physical_port_number: portNumber,
        });
        toast.success("Mapeamento de porta atualizado com sucesso");
      } else {
        // Usar asserção de tipo para garantir que 'logical_point_identifier' está presente
        await createPortMapping({ 
          ...values,
          patch_panel_id: patchPanelId,
          physical_port_number: portNumber,
        } as Omit<PortMapping, 'id'>);
        toast.success("Mapeamento de porta criado com sucesso");
      }
      
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving port mapping:", error);
      toast.error(`Falha ao ${existingMapping ? 'atualizar' : 'criar'} mapeamento de porta`);
    }
  };
  
  const handleDelete = async () => { // Tornar async
    if (!existingMapping) return;
    
    try {
      await deletePortMapping(existingMapping.id); // Adicionar await
      toast.success("Mapeamento de porta excluído com sucesso");
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error deleting port mapping:", error);
      toast.error("Falha ao excluir mapeamento de porta");
    }
  };

  const handleDownloadQRCode = () => {
    if (!qrCodeRef.current) {
      console.error("QR Code Canvas ref not found");
      toast.error("Não foi possível gerar o QR Code para download.");
      return;
    }
    if (!portNumber) {
        console.error("Port number is not defined");
        toast.error("Número da porta não definido para gerar QR Code.");
        return;
    }


    try {
      const canvas = qrCodeRef.current;
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream"); // Force download

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-porta-${patchPanelId}-${portNumber}.png`; // Dynamic filename
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("Download do QR Code iniciado.");
    } catch (error) {
      console.error("Error generating QR Code for download:", error);
      toast.error("Falha ao gerar QR Code para download.");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Hidden QR Code Canvas for Download */}
      {portNumber && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <QRCodeCanvas
            ref={qrCodeRef} // Assign the ref here
            value={`${window.location.origin}/port-info/${patchPanelId}/${portNumber}`}
            size={256} // Good size for download
            level="H"
            includeMargin={true}
            id={`qr-download-${patchPanelId}-${portNumber}`} // Unique ID might be useful
          />
        </div>
      )}
      <DialogContent> {/* Removida a classe sm:max-w-[425px] */}
        <DialogHeader>
          <DialogTitle>
            {existingMapping 
              ? `Editar Mapeamento da Porta ${portNumber}`
              : `Mapear Porta ${portNumber}`}
          </DialogTitle>
          <DialogDescription>
            {existingMapping 
              ? "Atualize o mapeamento para esta porta."
              : "Crie um novo mapeamento para esta porta."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="logical_point_identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador do Ponto Lógico</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 222" {...field} />
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
                      placeholder="ex: Mesa da recepção"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* QR Code Section Removed */}
            {/* Responsive footer: stack buttons on small, row on sm+ */}
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
              {/* Download Button */}
              {portNumber && ( // Only show if there's a port number
                <Button variant="outline" type="button" onClick={handleDownloadQRCode} className="w-full sm:w-auto">
                  Baixar QR Code
                </Button>
              )}
              {existingMapping && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {/* Full width on small screens */}
                    <Button variant="destructive" type="button" className="w-full sm:w-auto">
                      Remover Mapeamento
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso removerá o mapeamento para a porta {portNumber}. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {/* Full width on small screens */}
              <Button type="submit" className="w-full sm:w-auto">
                {existingMapping ? "Atualizar" : "Mapear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

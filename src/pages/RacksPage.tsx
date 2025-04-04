
import React, { useEffect, useState } from "react";
// Removida linha duplicada
import { Layout } from "@/components/Layout";
import { Rack, getRacks } from "@/lib/db";
import { RackView } from "@/components/RackView";
import { Button } from "@/components/ui/button";
// Lucide icons removed, using Remix Icon classes now
import { RackDialog } from "@/components/RackDialog";

const RacksPage = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [isRackDialogOpen, setIsRackDialogOpen] = useState(false);
  
  useEffect(() => {
    loadRacks();
  }, []);

  const loadRacks = async () => { // Tornar async
    try {
      const rackList = await getRacks(); // Usar await
      setRacks(rackList);
    } catch (err) {
      console.error("Error loading racks:", err);
    }
  };
  
  const handleAddRack = () => {
    setIsRackDialogOpen(true);
  };
  
  return (
    <Layout>
      {/* Responsive header layout: stack on small screens, row on larger screens */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          {/* Responsive heading size */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">Racks</h1> {/* Added font-display */}
          <p className="text-muted-foreground mt-1"> {/* Added margin-top for spacing */}
            Gerencie seus racks de infraestrutura e visualize seus equipamentos
          </p>
        </div>
        <Button onClick={handleAddRack}>
          <i className="ri-add-line mr-2 h-4 w-4"></i>
          Adicionar Rack
        </Button>
      </div>
      
      {racks.length > 0 ? (
        <div className="space-y-6">
          {racks.map((rack) => (
            <RackView 
              key={rack.id} 
              rack={rack} 
              onRackUpdate={loadRacks} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <i className="ri-server-line h-10 w-10 text-muted-foreground"></i>
          </div>
          <h2 className="mt-6 text-xl font-semibold">Nenhum rack encontrado</h2>
          <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
            Você ainda não criou nenhum rack. Adicione seu primeiro rack para começar a gerenciar sua infraestrutura de rede.
          </p>
          <Button onClick={handleAddRack}>
            <i className="ri-add-line mr-2 h-4 w-4"></i>
            Adicionar Rack
          </Button>
        </div>
      )}
      
      <RackDialog
        open={isRackDialogOpen}
        onOpenChange={setIsRackDialogOpen}
        onSave={loadRacks}
      />
    </Layout>
  );
};

export default RacksPage;

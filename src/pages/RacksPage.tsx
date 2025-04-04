
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Rack, getRacks } from "@/lib/db";
import { RackView } from "@/components/RackView";
import { Button } from "@/components/ui/button";
import { Plus, Server } from "lucide-react";
import { RackDialog } from "@/components/RackDialog";

const RacksPage = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [isRackDialogOpen, setIsRackDialogOpen] = useState(false);
  
  useEffect(() => {
    loadRacks();
  }, []);
  
  const loadRacks = () => {
    try {
      const rackList = getRacks();
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Racks</h1>
          <p className="text-muted-foreground">
            Manage your infrastructure racks and visualize their equipment
          </p>
        </div>
        <Button onClick={handleAddRack}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rack
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
            <Server className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No racks found</h2>
          <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
            You haven't created any racks yet. Add your first rack to start managing your network infrastructure.
          </p>
          <Button onClick={handleAddRack}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rack
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

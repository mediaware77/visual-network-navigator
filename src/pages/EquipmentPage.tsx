
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Equipment, Rack, getEquipmentByRackId, getRacks } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentDialog } from "@/components/EquipmentDialog";
import { Network, Plus, ServerCog } from "lucide-react";
import { EquipmentView } from "@/components/EquipmentView";

const EquipmentPage = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedRackId, setSelectedRackId] = useState<string>("");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    loadRacks();
  }, []);
  
  useEffect(() => {
    if (selectedRackId) {
      loadEquipment(parseInt(selectedRackId));
    } else {
      setEquipment([]);
    }
  }, [selectedRackId]);
  
  const loadRacks = () => {
    try {
      const rackList = getRacks();
      setRacks(rackList);
      
      if (rackList.length > 0 && !selectedRackId) {
        setSelectedRackId(rackList[0].id.toString());
      }
    } catch (err) {
      console.error("Error loading racks:", err);
    }
  };
  
  const loadEquipment = (rackId: number) => {
    try {
      const equipmentList = getEquipmentByRackId(rackId);
      setEquipment(equipmentList);
    } catch (err) {
      console.error("Error loading equipment:", err);
    }
  };
  
  const handleAddEquipment = () => {
    setIsDialogOpen(true);
  };
  
  const handleEquipmentUpdate = () => {
    if (selectedRackId) {
      loadEquipment(parseInt(selectedRackId));
    }
  };
  
  const getSelectedRack = () => {
    return selectedRackId ? racks.find(r => r.id === parseInt(selectedRackId)) : null;
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
          <p className="text-muted-foreground">
            Manage patch panels and switches in your racks
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Rack</CardTitle>
          <CardDescription>
            Choose a rack to view and manage its equipment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-64">
            <Select
              value={selectedRackId}
              onValueChange={setSelectedRackId}
              disabled={racks.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a rack" />
              </SelectTrigger>
              <SelectContent>
                {racks.map((rack) => (
                  <SelectItem key={rack.id} value={rack.id.toString()}>
                    {rack.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddEquipment} 
            disabled={!selectedRackId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </CardContent>
      </Card>
      
      {selectedRackId ? (
        <>
          {equipment.length > 0 ? (
            <div className="space-y-6">
              {equipment.map((eq) => (
                <EquipmentView 
                  key={eq.id} 
                  equipment={eq} 
                  onUpdate={handleEquipmentUpdate} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <ServerCog className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="mt-6 text-xl font-semibold">No equipment found</h2>
                <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
                  This rack doesn't have any equipment yet. Add patch panels or switches to get started.
                </p>
                <Button onClick={handleAddEquipment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Equipment
                </Button>
              </CardContent>
            </Card>
          )}
          
          <EquipmentDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            rackId={parseInt(selectedRackId)}
            onSave={handleEquipmentUpdate}
          />
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Network className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No racks available</h2>
            <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
              You need to create a rack before you can add equipment. Go to the Racks page to create one.
            </p>
            <Button asChild>
              <a href="/racks">Go to Racks</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default EquipmentPage;

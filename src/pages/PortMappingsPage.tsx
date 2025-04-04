
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Equipment, PortMapping, Rack, getEquipmentByRackId, getPortMappingsByPatchPanelId, getRacks } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ServerIcon, Cable, PlusIcon, Edit2, Search } from "lucide-react";
import { PortMappingDialog } from "@/components/PortMappingDialog";
import { Input } from "@/components/ui/input";

const PortMappingsPage = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedRackId, setSelectedRackId] = useState<string>("");
  const [patchPanels, setPatchPanels] = useState<Equipment[]>([]);
  const [selectedPanelId, setSelectedPanelId] = useState<string>("");
  const [portMappings, setPortMappings] = useState<PortMapping[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMappings, setFilteredMappings] = useState<PortMapping[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  
  useEffect(() => {
    loadRacks();
  }, []);
  
  useEffect(() => {
    if (selectedRackId) {
      loadPatchPanels(parseInt(selectedRackId));
    } else {
      setPatchPanels([]);
      setSelectedPanelId("");
    }
  }, [selectedRackId]);
  
  useEffect(() => {
    if (selectedPanelId) {
      loadPortMappings(parseInt(selectedPanelId));
    } else {
      setPortMappings([]);
    }
  }, [selectedPanelId]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMappings(portMappings);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredMappings(
        portMappings.filter(
          (mapping) =>
            mapping.logical_point_identifier.toLowerCase().includes(lowerQuery) ||
            mapping.description?.toLowerCase().includes(lowerQuery) ||
            mapping.physical_port_number.toString().includes(lowerQuery)
        )
      );
    }
  }, [searchQuery, portMappings]);
  
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
  
  const loadPatchPanels = (rackId: number) => {
    try {
      const equipmentList = getEquipmentByRackId(rackId);
      const panels = equipmentList.filter(eq => eq.equipment_type === 'PATCH_PANEL');
      setPatchPanels(panels);
      
      if (panels.length > 0 && (!selectedPanelId || !panels.find(p => p.id.toString() === selectedPanelId))) {
        setSelectedPanelId(panels[0].id.toString());
      } else if (panels.length === 0) {
        setSelectedPanelId("");
      }
    } catch (err) {
      console.error("Error loading patch panels:", err);
    }
  };
  
  const loadPortMappings = (panelId: number) => {
    try {
      const mappings = getPortMappingsByPatchPanelId(panelId);
      setPortMappings(mappings);
      setFilteredMappings(mappings);
    } catch (err) {
      console.error("Error loading port mappings:", err);
    }
  };
  
  const handleEditMapping = (portNumber: number) => {
    setSelectedPort(portNumber);
    setIsDialogOpen(true);
  };
  
  const handleAddMapping = () => {
    const panel = patchPanels.find(p => p.id.toString() === selectedPanelId);
    if (!panel) return;
    
    // Find the next available port
    const mappedPorts = new Set(portMappings.map(m => m.physical_port_number));
    let nextPort = 1;
    const portCount = panel.port_count || 24;
    
    while (mappedPorts.has(nextPort) && nextPort <= portCount) {
      nextPort++;
    }
    
    if (nextPort > portCount) {
      nextPort = 1; // Start from beginning if all ports are mapped
    }
    
    setSelectedPort(nextPort);
    setIsDialogOpen(true);
  };
  
  const handleDialogSave = () => {
    if (selectedPanelId) {
      loadPortMappings(parseInt(selectedPanelId));
    }
  };
  
  const getSelectedPatchPanel = () => {
    return selectedPanelId 
      ? patchPanels.find(p => p.id.toString() === selectedPanelId) 
      : null;
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Port Mappings</h1>
          <p className="text-muted-foreground">
            Manage logical point to physical port mappings
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Patch Panel</CardTitle>
          <CardDescription>
            Choose a rack and patch panel to manage its port mappings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            
            <div>
              <Select
                value={selectedPanelId}
                onValueChange={setSelectedPanelId}
                disabled={patchPanels.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patch panel" />
                </SelectTrigger>
                <SelectContent>
                  {patchPanels.map((panel) => (
                    <SelectItem key={panel.id} value={panel.id.toString()}>
                      {panel.identifier} {panel.model ? `(${panel.model})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedPanelId ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Port Mappings</CardTitle>
              <CardDescription>
                Mappings for patch panel {getSelectedPatchPanel()?.identifier}
              </CardDescription>
            </div>
            <Button onClick={handleAddMapping}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Mapping
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mappings..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredMappings.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Port</TableHead>
                      <TableHead>Logical Point</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMappings
                      .sort((a, b) => a.physical_port_number - b.physical_port_number)
                      .map((mapping) => (
                        <TableRow key={mapping.id}>
                          <TableCell className="font-medium">{mapping.physical_port_number}</TableCell>
                          <TableCell>{mapping.logical_point_identifier}</TableCell>
                          <TableCell className="hidden md:table-cell">{mapping.description || '—'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMapping(mapping.physical_port_number)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Cable className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No mappings found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  {searchQuery 
                    ? 'No mappings match your search criteria.' 
                    : 'This patch panel has no port mappings yet. Add a mapping to get started.'}
                </p>
                {searchQuery ? (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button className="mt-4" onClick={handleAddMapping}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add First Mapping
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ServerIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            {patchPanels.length === 0 ? (
              <>
                <h2 className="mt-6 text-xl font-semibold">No patch panels available</h2>
                <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
                  You need to add a patch panel to the selected rack before you can manage port mappings.
                </p>
                <Button asChild>
                  <a href="/equipment">Manage Equipment</a>
                </Button>
              </>
            ) : (
              <>
                <h2 className="mt-6 text-xl font-semibold">Select a Patch Panel</h2>
                <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
                  Please select a patch panel from the dropdown above to manage its port mappings.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {selectedPanelId && (
        <PortMappingDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          patchPanelId={parseInt(selectedPanelId)}
          portNumber={selectedPort}
          existingMappings={portMappings}
          onSave={handleDialogSave}
        />
      )}
    </Layout>
  );
};

export default PortMappingsPage;

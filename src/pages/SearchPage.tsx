
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PortMappingDetail, Rack, getPortMappingByLogicalPoint, getPortMappingByPhysicalLocation, getRackById, getRacks } from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, MapPin, Server } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [logicalPointId, setLogicalPointId] = useState("");
  const [rackId, setRackId] = useState<string>("");
  const [panelIdentifier, setPanelIdentifier] = useState("");
  const [portNumber, setPortNumber] = useState("");
  
  const [logicalPointResult, setLogicalPointResult] = useState<PortMappingDetail | null>(null);
  const [physicalLocationResult, setPhysicalLocationResult] = useState<any | null>(null);
  
  const [racks, setRacks] = useState<Rack[]>([]);
  
  React.useEffect(() => {
    try {
      const rackList = getRacks();
      setRacks(rackList);
    } catch (err) {
      console.error("Error loading racks:", err);
    }
  }, []);
  
  const handleLogicalPointSearch = () => {
    if (!logicalPointId.trim()) {
      toast.error("Please enter a logical point identifier");
      return;
    }
    
    try {
      const result = getPortMappingByLogicalPoint(logicalPointId);
      setLogicalPointResult(result);
      
      if (!result) {
        toast.error(`No mapping found for logical point "${logicalPointId}"`);
      }
    } catch (err) {
      console.error("Error searching for logical point:", err);
      toast.error("An error occurred during search");
    }
  };
  
  const handlePhysicalLocationSearch = () => {
    if (!rackId || !panelIdentifier || !portNumber) {
      toast.error("Please fill all physical location fields");
      return;
    }
    
    try {
      const rackIdNum = parseInt(rackId);
      const portNum = parseInt(portNumber);
      
      if (isNaN(portNum)) {
        toast.error("Port number must be a valid number");
        return;
      }
      
      const result = getPortMappingByPhysicalLocation(rackIdNum, panelIdentifier, portNum);
      
      if (result) {
        const rack = getRackById(rackIdNum);
        setPhysicalLocationResult({
          ...result,
          rack_name: rack?.name || `Rack ${rackIdNum}`,
          panel_identifier: panelIdentifier
        });
      } else {
        setPhysicalLocationResult(null);
        toast.error("No mapping found for this physical location");
      }
    } catch (err) {
      console.error("Error searching for physical location:", err);
      toast.error("An error occurred during search");
    }
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search</h1>
          <p className="text-muted-foreground">
            Find network points by logical ID or physical location
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="logical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="logical" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search by Logical Point</span>
          </TabsTrigger>
          <TabsTrigger value="physical" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Search by Physical Location</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find a Logical Point</CardTitle>
              <CardDescription>
                Enter a logical point identifier to find its physical location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="logicalPointId">Logical Point Identifier</Label>
                <div className="flex gap-2">
                  <Input
                    id="logicalPointId"
                    placeholder="e.g. 222"
                    value={logicalPointId}
                    onChange={(e) => setLogicalPointId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogicalPointSearch();
                      }
                    }}
                  />
                  <Button onClick={handleLogicalPointSearch}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {logicalPointResult && (
            <Card>
              <CardHeader>
                <CardTitle>Search Result</CardTitle>
                <CardDescription>
                  Physical location for logical point "{logicalPointResult.logical_point_identifier}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Rack</Label>
                    <p className="font-medium">{logicalPointResult.rack_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Patch Panel</Label>
                    <p className="font-medium">{logicalPointResult.panel_identifier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Port Number</Label>
                    <p className="font-medium">{logicalPointResult.physical_port_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="font-medium">{logicalPointResult.description || "—"}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/racks`} state={{ 
                  highlightRack: logicalPointResult.rack_id,
                  highlightEquipment: logicalPointResult.patch_panel_id,
                  highlightPort: logicalPointResult.physical_port_number
                }}>
                  <Button variant="outline">
                    <Server className="mr-2 h-4 w-4" />
                    View in Rack
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="physical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find by Physical Location</CardTitle>
              <CardDescription>
                Enter rack, patch panel, and port information to find the logical point
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="rackSelect">Rack</Label>
                  <Select value={rackId} onValueChange={setRackId}>
                    <SelectTrigger id="rackSelect">
                      <SelectValue placeholder="Select rack" />
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
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="panelIdentifier">Patch Panel Identifier</Label>
                  <Input
                    id="panelIdentifier"
                    placeholder="e.g. PP-01"
                    value={panelIdentifier}
                    onChange={(e) => setPanelIdentifier(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="portNumber">Port Number</Label>
                  <Input
                    id="portNumber"
                    placeholder="e.g. 15"
                    value={portNumber}
                    onChange={(e) => setPortNumber(e.target.value)}
                    type="number"
                    min="1"
                  />
                </div>
              </div>
              
              <Button onClick={handlePhysicalLocationSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </CardContent>
          </Card>
          
          {physicalLocationResult && (
            <Card>
              <CardHeader>
                <CardTitle>Search Result</CardTitle>
                <CardDescription>
                  Logical point for physical location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Logical Point ID</Label>
                    <p className="font-medium">{physicalLocationResult.logical_point_identifier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="font-medium">{physicalLocationResult.description || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">Physical Location</Label>
                    <p className="font-medium">
                      {physicalLocationResult.rack_name}, {physicalLocationResult.panel_identifier}, 
                      Port {physicalLocationResult.physical_port_number}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SearchPage;

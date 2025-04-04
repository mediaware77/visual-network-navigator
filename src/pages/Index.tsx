
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRacks, initDatabase, Equipment, getEquipmentByRackId, PortMapping, getPortMappingsByPatchPanelId } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowRight, Network, Server, Cable, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [stats, setStats] = useState({
    racks: 0,
    equipment: 0,
    patchPanels: 0,
    switches: 0,
    portMappings: 0,
  });
  
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setIsDbInitialized(true);
        loadStats();
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast.error("Failed to initialize database. Please refresh the page.");
      }
    };
    
    init();
  }, []);
  
  const loadStats = () => {
    try {
      const racks = getRacks();
      
      let equipment: Equipment[] = [];
      let portMappings: PortMapping[] = [];
      
      racks.forEach(rack => {
        const rackEquipment = getEquipmentByRackId(rack.id);
        equipment = [...equipment, ...rackEquipment];
        
        rackEquipment.forEach(eq => {
          if (eq.equipment_type === 'PATCH_PANEL') {
            const mappings = getPortMappingsByPatchPanelId(eq.id);
            portMappings = [...portMappings, ...mappings];
          }
        });
      });
      
      setStats({
        racks: racks.length,
        equipment: equipment.length,
        patchPanels: equipment.filter(eq => eq.equipment_type === 'PATCH_PANEL').length,
        switches: equipment.filter(eq => eq.equipment_type === 'SWITCH').length,
        portMappings: portMappings.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Visual Network Mapper
          </p>
        </div>
      </div>
      
      {isDbInitialized ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Racks
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.racks}</div>
                <p className="text-xs text-muted-foreground">
                  Network infrastructure racks
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Patch Panels
                </CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.patchPanels}</div>
                <p className="text-xs text-muted-foreground">
                  Passive connectivity panels
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Switches
                </CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.switches}</div>
                <p className="text-xs text-muted-foreground">
                  Active network switches
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Port Mappings
                </CardTitle>
                <Cable className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.portMappings}</div>
                <p className="text-xs text-muted-foreground">
                  Mapped logical points
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Link to="/racks">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>View Racks</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/equipment">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Manage Equipment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/port-mappings">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Port Mappings</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/search">
                  <Button className="w-full flex justify-between items-center" variant="outline">
                    <span>Search</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Visual Network Mapper helps you identify network points and their physical locations in your infrastructure. Navigate racks, patch panels, and port mappings with ease.
                </p>
                
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Visual rack and patch panel representation</li>
                  <li>Simple port to logical point mapping</li>
                  <li>Quick search by point ID or physical location</li>
                  <li>Centralized network documentation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Initializing Database</h3>
            <p className="text-center text-muted-foreground mb-4">
              Please wait while we initialize the database...
            </p>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default Index;

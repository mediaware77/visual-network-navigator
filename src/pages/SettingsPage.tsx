
import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Info, RotateCw, Settings } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [autoSave, setAutoSave] = React.useState(true);
  const [showPortTooltips, setShowPortTooltips] = React.useState(true);
  const [enableAnimations, setEnableAnimations] = React.useState(true);
  
  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    toast.success(`Auto-save ${checked ? 'enabled' : 'disabled'}`);
  };
  
  const handleShowPortTooltipsChange = (checked: boolean) => {
    setShowPortTooltips(checked);
    toast.success(`Port tooltips ${checked ? 'enabled' : 'disabled'}`);
  };
  
  const handleEnableAnimationsChange = (checked: boolean) => {
    setEnableAnimations(checked);
    toast.success(`Animations ${checked ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage application preferences and settings
          </p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application Settings
            </CardTitle>
            <CardDescription>
              Customize your experience with Visual Network Mapper
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto-save changes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save changes to the database
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={handleAutoSaveChange}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="show-tooltips">Show port tooltips</Label>
                <p className="text-sm text-muted-foreground">
                  Display tooltips when hovering over ports
                </p>
              </div>
              <Switch
                id="show-tooltips"
                checked={showPortTooltips}
                onCheckedChange={handleShowPortTooltipsChange}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="enable-animations">Enable animations</Label>
                <p className="text-sm text-muted-foreground">
                  Use animations for highlighting and transitions
                </p>
              </div>
              <Switch
                id="enable-animations"
                checked={enableAnimations}
                onCheckedChange={handleEnableAnimationsChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
            <CardDescription>
              Information about Visual Network Mapper
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Visual Network Mapper (VNM)</h3>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-1">What is VNM?</h3>
              <p className="text-sm text-muted-foreground">
                Visual Network Mapper is a tool designed to help network administrators and technicians manage and visualize network infrastructure. It provides a visual representation of racks, patch panels, and port mappings, making it easy to locate physical equipment and logical network points.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-1">Features</h3>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>Visual rack and equipment representation</li>
                <li>Port mapping management</li>
                <li>Search by logical point or physical location</li>
                <li>Database export and import for backups</li>
                <li>Responsive design for desktop and mobile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;

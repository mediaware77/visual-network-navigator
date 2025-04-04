
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { exportDatabase, importDatabase } from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Download, Upload, AlertTriangle, Database, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DatabasePage = () => {
  const [isImporting, setIsImporting] = useState(false);
  
  const handleExportDatabase = () => {
    try {
      const data = exportDatabase();
      
      // Create a blob from the data
      const blob = new Blob([data], { type: 'application/octet-stream' });
      
      // Create a link to download the blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visual-network-mapper-${new Date().toISOString().slice(0, 10)}.sqlite`;
      
      // Click the link to download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Database exported successfully");
    } catch (err) {
      console.error("Error exporting database:", err);
      toast.error("Failed to export database");
    }
  };
  
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) throw new Error("Failed to read file");
        
        // Import the database
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        importDatabase(data);
        
        toast.success("Database imported successfully");
      } catch (err) {
        console.error("Error importing database:", err);
        toast.error("Failed to import database. The file may be corrupted or invalid.");
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      console.error("Error reading file");
      toast.error("Failed to read the file");
      setIsImporting(false);
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  const handleResetDatabase = () => {
    // This will effectively reset the database to its initial state
    window.location.reload();
    toast.success("Database reset successfully");
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground">
            Export, import, and manage your database
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Database
            </CardTitle>
            <CardDescription>
              Save your current database to a file for backup or transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download your current database as an SQLite file. This file contains all your racks, equipment, and port mappings.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExportDatabase}>
              <Download className="mr-2 h-4 w-4" />
              Export Database
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Database
            </CardTitle>
            <CardDescription>
              Replace your current database with a previously exported file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a previously exported database file. This will replace your current database with the imported one.
            </p>
            <p className="text-sm font-medium text-destructive mb-4">
              Warning: This will overwrite all your current data.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Database
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Importing a database will replace all your current data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <label className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                      <input
                        type="file"
                        accept=".sqlite"
                        className="sr-only"
                        onChange={handleImportFile}
                        disabled={isImporting}
                      />
                    </label>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Maintenance
            </CardTitle>
            <CardDescription>
              Reset or reinitialize your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Reset Database</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset your database to its initial state with demo data. All your current data will be lost.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Database
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset your database to its initial state with demo data. All your current data will be permanently lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetDatabase}>
                        Reset Database
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-1">Database Information</h3>
                <p className="text-sm text-muted-foreground">
                  This application uses an in-browser SQLite database stored in memory. All data is retained only for the current session and will be lost when you close or refresh the page, unless you export it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DatabasePage;

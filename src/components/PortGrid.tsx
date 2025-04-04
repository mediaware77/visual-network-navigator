
import React from "react";
import { PortMapping } from "@/lib/db";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PortGridProps {
  portCount: number;
  mappings: PortMapping[];
  onPortClick: (portNumber: number) => void;
  highlightPort?: number;
}

export function PortGrid({ portCount, mappings, onPortClick, highlightPort }: PortGridProps) {
  // Create an array of port numbers from 1 to portCount
  const portNumbers = Array.from({ length: portCount }, (_, i) => i + 1);
  
  // Convert mappings array to a map for easy lookup
  const mappingsMap = mappings.reduce((acc, mapping) => {
    acc[mapping.physical_port_number] = mapping;
    return acc;
  }, {} as Record<number, PortMapping>);
  
  // Determine number of rows (assuming 12 ports per row)
  const portsPerRow = 12;
  const rows = Math.ceil(portCount / portsPerRow);
  
  // Group ports by row
  const portsByRow = Array.from({ length: rows }, (_, rowIndex) => {
    const startPort = rowIndex * portsPerRow + 1;
    const endPort = Math.min(startPort + portsPerRow - 1, portCount);
    return portNumbers.slice(startPort - 1, endPort);
  });
  
  const getPortClass = (portNumber: number) => {
    const baseClass = "port relative";
    
    if (highlightPort === portNumber) {
      return `${baseClass} port-highlight`;
    }
    
    return mappingsMap[portNumber] 
      ? `${baseClass} port-mapped` 
      : `${baseClass} port-unmapped`;
  };
  
  return (
    <div className="port-grid-wrapper">
      {portsByRow.map((rowPorts, rowIndex) => (
        <div key={rowIndex} className="port-grid">
          {rowPorts.map((portNumber) => {
            const mapping = mappingsMap[portNumber];
            
            return (
              <TooltipProvider key={portNumber}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={getPortClass(portNumber)}
                      onClick={() => onPortClick(portNumber)}
                    >
                      {mapping ? mapping.logical_point_identifier : ''}
                      <span className="port-number">{portNumber}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {mapping ? (
                      <>
                        <div><strong>Porta:</strong> {portNumber}</div>
                        <div><strong>Ponto:</strong> {mapping.logical_point_identifier}</div>
                        {mapping.description && (
                          <div><strong>Descrição:</strong> {mapping.description}</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div><strong>Porta:</strong> {portNumber}</div>
                        <div>Não mapeado</div>
                      </>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      ))}
    </div>
  );
}

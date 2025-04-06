import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortMappingsByPatchPanelId, getEquipmentById, getRackById, PortMapping, Equipment, Rack } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PortInfo {
  mapping: PortMapping | null;
  equipment: Equipment | null;
  rack: Rack | null;
}

export function PortInfoPage() {
  const { patchPanelId: patchPanelIdParam, portNumber: portNumberParam } = useParams<{ patchPanelId: string; portNumber: string }>();
  const [portInfo, setPortInfo] = useState<PortInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPortInfo(null); // Reset info on param change

      const patchPanelId = parseInt(patchPanelIdParam || '', 10);
      const portNumber = parseInt(portNumberParam || '', 10);

      if (isNaN(patchPanelId) || isNaN(portNumber)) {
        setError("IDs inválidos na URL.");
        setLoading(false);
        return;
      }

      try {
        // 1. Buscar mapeamentos para o painel
        const mappings = await getPortMappingsByPatchPanelId(patchPanelId);
        const specificMapping = mappings.find(m => m.physical_port_number === portNumber) || null;

        // 2. Buscar detalhes do equipamento (patch panel)
        const equipment = await getEquipmentById(patchPanelId);
        if (!equipment) {
          throw new Error(`Equipamento com ID ${patchPanelId} não encontrado.`);
        }
        if (equipment.equipment_type !== 'PATCH_PANEL') {
            throw new Error(`Equipamento ${patchPanelId} não é um Patch Panel.`);
        }

        // 3. Buscar detalhes do rack
        const rack = await getRackById(equipment.rack_id);
        if (!rack) {
          throw new Error(`Rack com ID ${equipment.rack_id} não encontrado.`);
        }

        setPortInfo({
          mapping: specificMapping,
          equipment: equipment,
          rack: rack,
        });

      } catch (err: any) {
        console.error("Erro ao buscar informações da porta:", err);
        setError(err.message || "Ocorreu um erro ao buscar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patchPanelIdParam, portNumberParam]);

  const renderSkeleton = () => (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  );

  const renderError = () => (
     <Alert variant="destructive" className="w-full max-w-md mx-auto mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return renderError();
  }

  if (!portInfo || !portInfo.equipment || !portInfo.rack) {
     return (
        <Alert variant="destructive" className="w-full max-w-md mx-auto mt-10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Não foi possível carregar todas as informações necessárias.</AlertDescription>
        </Alert>
     )
  }

  const { mapping, equipment, rack } = portInfo;

  return (
    <div className="container mx-auto p-4 pt-10 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Informações da Porta Física {portNumberParam}</CardTitle>
          <CardDescription>Detalhes do mapeamento, equipamento e localização.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informações do Mapeamento */}
          <div className="border p-3 rounded-md">
            <h3 className="font-semibold mb-2 text-lg">Mapeamento da Porta</h3>
            {mapping ? (
              <>
                <p><strong>Ponto Lógico:</strong> {mapping.logical_point_identifier}</p>
                <p><strong>Descrição:</strong> {mapping.description || <span className="text-muted-foreground">N/A</span>}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Nenhum mapeamento encontrado para esta porta.</p>
            )}
          </div>

          {/* Informações do Equipamento (Patch Panel) */}
          <div className="border p-3 rounded-md">
            <h3 className="font-semibold mb-2 text-lg">Equipamento (Patch Panel)</h3>
            <p><strong>Identificador:</strong> {equipment.identifier}</p>
            <p><strong>Modelo:</strong> {equipment.model || <span className="text-muted-foreground">N/A</span>}</p>
            <p><strong>Total de Portas:</strong> {equipment.port_count || <span className="text-muted-foreground">N/A</span>}</p>
            <p><strong>Posição U:</strong> {equipment.u_position || <span className="text-muted-foreground">N/A</span>}</p>
            <p><strong>Descrição:</strong> {equipment.description || <span className="text-muted-foreground">N/A</span>}</p>
          </div>

          {/* Informações do Rack */}
          <div className="border p-3 rounded-md">
            <h3 className="font-semibold mb-2 text-lg">Rack</h3>
            <p><strong>Nome:</strong> {rack.name}</p>
            <p><strong>Localização:</strong> {rack.location || <span className="text-muted-foreground">N/A</span>}</p>
            <p><strong>Descrição:</strong> {rack.description || <span className="text-muted-foreground">N/A</span>}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
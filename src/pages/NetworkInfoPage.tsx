import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEquipmentById, getRackById, Equipment, Rack } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react'; // Corrigir importação para nomeada

const NetworkInfoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('equipment_id');

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [rack, setRack] = useState<Rack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [pageUrl, setPageUrl] = useState<string>(''); // State to hold the URL - REMOVED

  useEffect(() => {
    // Set the URL once the component mounts and window is available - REMOVED
    // setPageUrl(window.location.href);

    const fetchNetworkInfo = async () => {
      setLoading(true);
      setError(null);

      if (!equipmentId || isNaN(parseInt(equipmentId, 10))) {
        setError('ID do Equipamento inválido ou não fornecido.');
        setLoading(false);
        return;
      }

      const id = parseInt(equipmentId, 10);

      try {
        const fetchedEquipment = await getEquipmentById(id);
        if (!fetchedEquipment) {
          setError(`Equipamento com ID ${id} não encontrado.`);
          setEquipment(null);
          setRack(null);
        } else {
          setEquipment(fetchedEquipment);
          // Busca o rack associado
          if (fetchedEquipment.rack_id) {
            const fetchedRack = await getRackById(fetchedEquipment.rack_id);
            setRack(fetchedRack);
          } else {
            setRack(null);
          }
        }
      } catch (err: any) {
        console.error("Erro ao buscar informações:", err);
        setError(err.message || 'Ocorreu um erro ao buscar as informações.');
        setEquipment(null);
        setRack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkInfo();
  }, [equipmentId]);

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          {/* Skeleton for QR Code area */}
          <div className="mt-6 pt-4 border-t text-center">
             <Skeleton className="h-8 w-1/4 mb-3 mx-auto" />
             <Skeleton className="inline-block h-[176px] w-[176px] p-2 border rounded-md" /> {/* Approx size of QR + padding */}
             <Skeleton className="h-4 w-1/2 mt-2 mx-auto" />
             <Skeleton className="h-3 w-3/4 mt-1 mx-auto" />
          </div>
        </>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!equipment) {
       return null; // Error handled above
    }

    return (
      <div className="space-y-2">
        <p><strong>ID:</strong> {equipment.id}</p>
        <p><strong>Identificador:</strong> {equipment.identifier}</p>
        <p><strong>Tipo:</strong> {equipment.equipment_type}</p>
        <p><strong>Modelo:</strong> {equipment.model || 'N/A'}</p>
        <p><strong>Rack:</strong> {rack ? `${rack.name} (ID: ${rack.id}, Local: ${rack.location || 'N/A'})` : 'N/A'}</p>
        {/* Placeholder para o QR Code */}
        <div className="mt-6 pt-4 border-t text-center">
           <h3 className="text-lg font-semibold mb-3">QR Code</h3>
           {equipmentId ? ( // Only render QR code if equipmentId is available
             <div className="inline-block p-2 border rounded-md bg-white">
               {/* Pass equipmentId as the value for the QR code */}
               <QRCodeCanvas value={equipmentId} size={160} level="H" includeMargin={false} />
             </div>
           ) : (
             <Skeleton className="inline-block h-[164px] w-[164px] p-2 border rounded-md" /> // Placeholder if ID not available
           )}
           <p className="text-sm text-muted-foreground mt-2">QR Code para identificação do equipamento.</p>
           {/* Removed URL display */}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informações do Equipamento</CardTitle>
          <CardDescription>Detalhes do equipamento associado a este QR Code.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkInfoPage;
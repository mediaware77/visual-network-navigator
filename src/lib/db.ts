import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Tipos locais (mantidos por enquanto para compatibilidade com a UI existente)
// Idealmente, poderíamos usar os tipos gerados pelo Supabase diretamente ou mapeá-los.
export interface Rack {
  id: number;
  name: string;
  location?: string | null; // Supabase pode retornar null
  description?: string | null; // Supabase pode retornar null
}

export interface Equipment {
  id: number;
  rack_id: number;
  equipment_type: 'PATCH_PANEL' | 'SWITCH'; // O tipo Supabase é string, precisamos garantir a validação
  identifier: string;
  model?: string | null;
  port_count?: number | null;
  u_position?: number | null;
  description?: string | null;
}

export interface PortMapping {
  id: number;
  patch_panel_id: number;
  physical_port_number: number;
  logical_point_identifier: string;
  description?: string | null;
}

export interface PortMappingDetail extends PortMapping {
  panel_identifier: string;
  rack_id: number;
  rack_name: string;
}

// Tipos Supabase para referência rápida
type RackRow = Tables<'racks'>;
type EquipmentRow = Tables<'equipments'>;
type PortMappingRow = Tables<'port_mappings'>;

type RackInsert = TablesInsert<'racks'>;
type EquipmentInsert = TablesInsert<'equipments'>;
type PortMappingInsert = TablesInsert<'port_mappings'>;

type RackUpdate = TablesUpdate<'racks'>;
type EquipmentUpdate = TablesUpdate<'equipments'>;
type PortMappingUpdate = TablesUpdate<'port_mappings'>;


// --- Funções de Operação do Banco de Dados (Supabase) ---

// Função auxiliar para tratamento de erros Supabase
const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error (${context}):`, error);
  toast.error(`Database error (${context}): ${error.message}`);
  throw new Error(`Supabase error (${context}): ${error.message}`);
};

// Racks
export const getRacks = async (): Promise<Rack[]> => {
  const { data, error } = await supabase
    .from('racks')
    .select('id, name, location, description')
    .order('name');

  if (error) handleSupabaseError(error, 'fetching racks');
  return (data as Rack[]) || []; // Retorna array vazio se data for null
};

export const getRackById = async (id: number): Promise<Rack | null> => {
  const { data, error } = await supabase
    .from('racks')
    .select('id, name, location, description')
    .eq('id', id)
    .single(); // Espera um único resultado ou null

  if (error && error.code !== 'PGRST116') { // PGRST116: Row not found, o que é esperado
     handleSupabaseError(error, `fetching rack ${id}`);
  }
  return data as Rack | null;
};

export const createRack = async (rack: Omit<Rack, 'id'>): Promise<Rack> => {
  // Mapeia para o tipo Insert do Supabase
  const rackInsert: RackInsert = {
    name: rack.name,
    location: rack.location,
    description: rack.description,
  };

  const { data, error } = await supabase
    .from('racks')
    .insert(rackInsert)
    .select('id, name, location, description')
    .single(); // Retorna o registro criado

  if (error) handleSupabaseError(error, 'creating rack');
  if (!data) throw new Error("Failed to create rack, no data returned.");
  return data as Rack;
};

export const updateRack = async (id: number, rackUpdate: Partial<Omit<Rack, 'id'>>): Promise<Rack> => {
   // Mapeia para o tipo Update do Supabase
   const rackSupabaseUpdate: RackUpdate = { ...rackUpdate };

  const { data, error } = await supabase
    .from('racks')
    .update(rackSupabaseUpdate)
    .eq('id', id)
    .select('id, name, location, description')
    .single();

  if (error) handleSupabaseError(error, `updating rack ${id}`);
  if (!data) throw new Error(`Failed to update rack ${id}, no data returned.`);
  return data as Rack;
};

export const deleteRack = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('racks')
    .delete()
    .eq('id', id);

  if (error) handleSupabaseError(error, `deleting rack ${id}`);
};

// Equipment
export const getEquipmentByRackId = async (rackId: number): Promise<Equipment[]> => {
  const { data, error } = await supabase
    .from('equipments')
    .select('id, rack_id, equipment_type, identifier, model, port_count, u_position, description')
    .eq('rack_id', rackId)
    .order('u_position', { nullsFirst: false }) // Equivalente a NULLS LAST
    .order('identifier');

  if (error) handleSupabaseError(error, `fetching equipment for rack ${rackId}`);
  // Precisamos garantir que equipment_type seja 'PATCH_PANEL' ou 'SWITCH'
  return (data as Equipment[])?.filter(eq => eq.equipment_type === 'PATCH_PANEL' || eq.equipment_type === 'SWITCH') || [];
};

export const getEquipmentById = async (id: number): Promise<Equipment | null> => {
  const { data, error } = await supabase
    .from('equipments')
    .select('id, rack_id, equipment_type, identifier, model, port_count, u_position, description')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
     handleSupabaseError(error, `fetching equipment ${id}`);
  }
  if (data && (data.equipment_type !== 'PATCH_PANEL' && data.equipment_type !== 'SWITCH')) {
      console.warn(`Equipment ${id} has invalid type: ${data.equipment_type}`);
      return null; // Ou lançar um erro?
  }
  return data as Equipment | null;
};

export const createEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
  const equipmentInsert: EquipmentInsert = {
     ...equipment,
     // Garante que valores opcionais sejam null se undefined
     model: equipment.model ?? null,
     port_count: equipment.port_count ?? null,
     u_position: equipment.u_position ?? null,
     description: equipment.description ?? null,
  };

  const { data, error } = await supabase
    .from('equipments')
    .insert(equipmentInsert)
    .select('id, rack_id, equipment_type, identifier, model, port_count, u_position, description')
    .single();

  if (error) handleSupabaseError(error, 'creating equipment');
  if (!data) throw new Error("Failed to create equipment, no data returned.");
  return data as Equipment;
};

export const updateEquipment = async (id: number, equipmentUpdate: Partial<Omit<Equipment, 'id'>>): Promise<Equipment> => {
  const equipmentSupabaseUpdate: EquipmentUpdate = { ...equipmentUpdate };

  const { data, error } = await supabase
    .from('equipments')
    .update(equipmentSupabaseUpdate)
    .eq('id', id)
    .select('id, rack_id, equipment_type, identifier, model, port_count, u_position, description')
    .single();

  if (error) handleSupabaseError(error, `updating equipment ${id}`);
   if (!data) throw new Error(`Failed to update equipment ${id}, no data returned.`);
  return data as Equipment;
};

export const deleteEquipment = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('equipments')
    .delete()
    .eq('id', id);

  if (error) handleSupabaseError(error, `deleting equipment ${id}`);
};

// Port Mappings
export const getPortMappingsByPatchPanelId = async (patchPanelId: number): Promise<PortMapping[]> => {
  // Primeiro, verifica se o ID pertence a um PATCH_PANEL
  const { data: panelData, error: panelError } = await supabase
      .from('equipments')
      .select('id')
      .eq('id', patchPanelId)
      .eq('equipment_type', 'PATCH_PANEL')
      .maybeSingle(); // Pode não encontrar

  if (panelError) handleSupabaseError(panelError, `verifying patch panel ${patchPanelId}`);
  if (!panelData) {
      console.warn(`Attempted to get port mappings for non-patch panel ID: ${patchPanelId}`);
      return []; // Retorna vazio se não for um patch panel
  }

  // Busca os mapeamentos
  const { data, error } = await supabase
    .from('port_mappings')
    .select('id, patch_panel_id, physical_port_number, logical_point_identifier, description')
    .eq('patch_panel_id', patchPanelId)
    .order('physical_port_number');

  if (error) handleSupabaseError(error, `fetching port mappings for panel ${patchPanelId}`);
  return (data as PortMapping[]) || [];
};

// NOTA: getPortMappingByLogicalPoint e getPortMappingByPhysicalLocation
// precisam ser reescritos usando JOINs ou múltiplas queries,
// pois o Supabase JS client não suporta JOINs diretamente em `select`.
// Uma alternativa é criar Views ou Funções RPC no Supabase.
// Por simplicidade agora, vamos usar múltiplas queries.

export const getPortMappingByLogicalPoint = async (logicalPointId: string): Promise<PortMappingDetail | null> => {
  const { data: mappingData, error: mappingError } = await supabase
    .from('port_mappings')
    .select('id, patch_panel_id, physical_port_number, logical_point_identifier, description')
    .eq('logical_point_identifier', logicalPointId)
    .maybeSingle(); // Pode não encontrar

  if (mappingError) handleSupabaseError(mappingError, `fetching mapping for logical point ${logicalPointId}`);
  if (!mappingData) return null;

  // Busca o equipamento (patch panel) associado
  const { data: equipmentData, error: equipmentError } = await supabase
    .from('equipments')
    .select('id, identifier, rack_id')
    .eq('id', mappingData.patch_panel_id)
    .single(); // Deve encontrar se o mapeamento existe

  if (equipmentError) handleSupabaseError(equipmentError, `fetching equipment ${mappingData.patch_panel_id} for mapping`);
  if (!equipmentData) return null; // Inconsistência de dados?

  // Busca o rack associado
  const { data: rackData, error: rackError } = await supabase
    .from('racks')
    .select('id, name')
    .eq('id', equipmentData.rack_id)
    .single(); // Deve encontrar

  if (rackError) handleSupabaseError(rackError, `fetching rack ${equipmentData.rack_id} for mapping`);
  if (!rackData) return null; // Inconsistência de dados?

  // Combina os dados
  const result: PortMappingDetail = {
    ...(mappingData as PortMapping),
    panel_identifier: equipmentData.identifier,
    rack_id: rackData.id,
    rack_name: rackData.name,
  };

  return result;
};

export const getPortMappingByPhysicalLocation = async (
  rackId: number,
  panelIdentifier: string,
  portNumber: number
): Promise<PortMapping | null> => {
   // 1. Encontra o ID do equipamento (patch panel)
   const { data: equipmentData, error: equipmentError } = await supabase
     .from('equipments')
     .select('id')
     .eq('rack_id', rackId)
     .eq('identifier', panelIdentifier)
     .eq('equipment_type', 'PATCH_PANEL')
     .maybeSingle();

   if (equipmentError) handleSupabaseError(equipmentError, `finding panel ${panelIdentifier} in rack ${rackId}`);
   if (!equipmentData) return null; // Painel não encontrado

   const patchPanelId = equipmentData.id;

   // 2. Busca o mapeamento usando o ID do painel e o número da porta
   const { data: mappingData, error: mappingError } = await supabase
     .from('port_mappings')
     .select('id, patch_panel_id, physical_port_number, logical_point_identifier, description')
     .eq('patch_panel_id', patchPanelId)
     .eq('physical_port_number', portNumber)
     .maybeSingle();

   if (mappingError) handleSupabaseError(mappingError, `fetching mapping for panel ${patchPanelId} port ${portNumber}`);

   return mappingData as PortMapping | null;
};


export const createPortMapping = async (mapping: Omit<PortMapping, 'id'>): Promise<PortMapping> => {
  const mappingInsert: PortMappingInsert = {
      ...mapping,
      description: mapping.description ?? null,
  };

  const { data, error } = await supabase
    .from('port_mappings')
    .insert(mappingInsert)
    .select('id, patch_panel_id, physical_port_number, logical_point_identifier, description')
    .single();

  if (error) handleSupabaseError(error, 'creating port mapping');
  if (!data) throw new Error("Failed to create port mapping, no data returned.");
  return data as PortMapping;
};

export const updatePortMapping = async (id: number, mappingUpdate: Partial<Omit<PortMapping, 'id'>>): Promise<PortMapping> => {
  const mappingSupabaseUpdate: PortMappingUpdate = { ...mappingUpdate };

  const { data, error } = await supabase
    .from('port_mappings')
    .update(mappingSupabaseUpdate)
    .eq('id', id)
    .select('id, patch_panel_id, physical_port_number, logical_point_identifier, description')
    .single();

  if (error) handleSupabaseError(error, `updating port mapping ${id}`);
  if (!data) throw new Error(`Failed to update port mapping ${id}, no data returned.`);
  return data as PortMapping;
};

export const deletePortMapping = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('port_mappings')
    .delete()
    .eq('id', id);

  if (error) handleSupabaseError(error, `deleting port mapping ${id}`);
};

// Funções removidas: initDatabase, createTables, seedDemoData, exportDatabase, importDatabase

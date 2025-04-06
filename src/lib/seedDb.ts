import {
  createRack,
  createEquipment,
  createPortMapping,
  getEquipmentByRackId,
  getRacks,
  deletePortMapping,
  deleteEquipment,
  deleteRack,
} from './db';
import type { Rack, Equipment, PortMapping } from './db';
import { toast } from 'sonner';

// --- Configurações da Geração ---
const NUM_RACKS_TO_CREATE = 5;
const MIN_EQUIPMENT_PER_RACK = 3;
const MAX_EQUIPMENT_PER_RACK = 8;
const CHANCE_OF_SWITCH = 0.4; // 40% de chance de ser um Switch, 60% Patch Panel
const COMMON_PORT_COUNTS = [24, 48];
const MAX_U_POSITION = 42;

// --- Funções Auxiliares de Geração ---

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const rackLocations = ["Datacenter Principal", "Sala Servidores A", "Andar 3 - Bloco B", "Escritório TI", "Laboratório Redes"];
const switchModels = ["Cisco Catalyst 9300", "Juniper EX4300", "Dell PowerSwitch S4148F", "HPE Aruba 2930F", "MikroTik CRS328"];
const patchPanelModels = ["Furukawa Cat6", "Nexans Essential", "Panduit NetKey", "Legrand LCS3", "Generic UTP Panel"];

// --- Funções de Geração de Dados ---

async function generateRacks(count: number): Promise<Rack[]> {
  const createdRacks: Rack[] = [];
  console.log(`Gerando ${count} racks...`);
  for (let i = 1; i <= count; i++) {
    const rackData: Omit<Rack, 'id'> = {
      name: `RACK-${String(i).padStart(2, '0')}`,
      location: getRandomElement(rackLocations) + ` #${i}`,
      description: `Rack de demonstração ${i}`,
    };
    try {
      const newRack = await createRack(rackData);
      createdRacks.push(newRack);
      console.log(`Rack "${newRack.name}" (ID: ${newRack.id}) criado.`);
      toast.success(`Rack "${newRack.name}" criado.`);
    } catch (error) {
      console.error(`Erro ao criar rack ${i}:`, error);
      toast.error(`Erro ao criar rack ${i}.`);
    }
  }
  console.log(`${createdRacks.length} racks criados.`);
  return createdRacks;
}

async function generateEquipmentForRack(rack: Rack): Promise<Equipment[]> {
  const createdEquipment: Equipment[] = [];
  const numEquipment = getRandomInt(MIN_EQUIPMENT_PER_RACK, MAX_EQUIPMENT_PER_RACK);

  // Buscar equipamentos existentes para verificar posições U ocupadas
  const existingEquipment = await getEquipmentByRackId(rack.id);
  const existingUPositions = new Set<number>(
    existingEquipment.map(eq => eq.u_position).filter((pos): pos is number => pos !== null && pos !== undefined)
  );
  console.log(` Rack ${rack.id} já possui ${existingEquipment.length} equipamentos. Posições U ocupadas:`, Array.from(existingUPositions));

  const usedUPositionsThisRun = new Set<number>(); // Posições usadas nesta execução específica
  console.log(`Gerando ${numEquipment} novos equipamentos para o Rack "${rack.name}" (ID: ${rack.id})...`);
  for (let i = 1; i <= numEquipment; i++) {
    const isSwitch = Math.random() < CHANCE_OF_SWITCH;
    const equipmentType = isSwitch ? 'SWITCH' : 'PATCH_PANEL';
    const portCount = getRandomElement(COMMON_PORT_COUNTS);

    let uPosition: number | null = null;
    // Tenta encontrar uma posição U não utilizada
    for (let attempt = 0; attempt < MAX_U_POSITION * 2; attempt++) {
        const potentialUPos = getRandomInt(1, MAX_U_POSITION);
        // Verifica se a posição está livre (não existe no DB e não foi usada nesta execução)
        if (!existingUPositions.has(potentialUPos) && !usedUPositionsThisRun.has(potentialUPos)) {
            uPosition = potentialUPos;
            usedUPositionsThisRun.add(uPosition); // Adiciona à lista desta execução
            break;
        }
    }
    if (uPosition === null) {
        console.warn(`Não foi possível encontrar posição U livre para equipamento no rack ${rack.id}`);
    }


    const equipmentData: Omit<Equipment, 'id'> = {
      rack_id: rack.id,
      equipment_type: equipmentType,
      identifier: `${isSwitch ? 'SW' : 'PP'}-${rack.name.split('-')[1]}-${String(i).padStart(2, '0')}`,
      model: isSwitch ? getRandomElement(switchModels) : getRandomElement(patchPanelModels),
      port_count: portCount,
      u_position: uPosition,
      description: `${equipmentType === 'SWITCH' ? 'Switch' : 'Patch Panel'} de demonstração ${i} no rack ${rack.name}`,
    };

    try {
      const newEquipment = await createEquipment(equipmentData);
      createdEquipment.push(newEquipment);
      console.log(` Equipamento "${newEquipment.identifier}" (ID: ${newEquipment.id}, Tipo: ${newEquipment.equipment_type}, Portas: ${newEquipment.port_count}, U: ${newEquipment.u_position ?? 'N/A'}) criado para o Rack ${rack.id}.`);
       toast.success(`Equipamento "${newEquipment.identifier}" criado.`);
    } catch (error) {
      console.error(`Erro ao criar equipamento ${i} para o rack ${rack.id}:`, error);
      toast.error(`Erro ao criar equipamento ${i} para o rack ${rack.id}.`);
    }
  }
  console.log(`${createdEquipment.length} equipamentos criados para o Rack "${rack.name}".`);
  return createdEquipment;
}

async function generatePortMappingsForPanel(panel: Equipment): Promise<PortMapping[]> {
  if (panel.equipment_type !== 'PATCH_PANEL' || !panel.port_count) {
    return []; // Só gera mapeamentos para Patch Panels com contagem de portas definida
  }

  const createdMappings: PortMapping[] = [];
  const numPorts = panel.port_count;
  console.log(` Gerando mapeamentos para Patch Panel "${panel.identifier}" (ID: ${panel.id}, Portas: ${numPorts})...`);

  for (let portNum = 1; portNum <= numPorts; portNum++) {
    // Gera um identificador lógico mais descritivo
    const building = getRandomElement(["BlocoA", "BlocoB", "PredioPrincipal"]);
    const floor = getRandomInt(1, 5);
    const room = getRandomInt(101, 599);
    const outlet = String(getRandomInt(1, 4)).padStart(2, '0');
    const logicalPoint = `${building}-Andar${floor}-Sala${room}-Tomada${outlet}`; // Exemplo: BlocoA-Andar3-Sala305-Tomada01

    const mappingData: Omit<PortMapping, 'id'> = {
      patch_panel_id: panel.id,
      physical_port_number: portNum,
      logical_point_identifier: logicalPoint,
      description: `Mapeamento automático para ${panel.identifier} Porta ${portNum}`,
    };

    try {
      // Adiciona uma pequena chance de não mapear uma porta
      if (Math.random() > 0.1) { // 90% de chance de mapear
        const newMapping = await createPortMapping(mappingData);
        createdMappings.push(newMapping);
        // console.log(`   Mapeamento criado para ${panel.identifier} Porta ${portNum} -> ${logicalPoint}`); // Log muito verboso
      } else {
         console.log(`   Porta ${portNum} do painel ${panel.identifier} deixada sem mapeamento.`);
      }
    } catch (error: any) {
        // Verifica se o erro é de violação de chave única (logical_point_identifier)
        if (error.message && error.message.includes('duplicate key value violates unique constraint "port_mappings_logical_point_identifier_key"')) {
            console.warn(`   Ponto lógico "${logicalPoint}" já existe. Pulando mapeamento para porta ${portNum} do painel ${panel.identifier}.`);
            toast.warning(`Ponto lógico "${logicalPoint}" duplicado.`);
        } else {
            console.error(`Erro ao criar mapeamento para ${panel.identifier} Porta ${portNum}:`, error);
            toast.error(`Erro mapeamento ${panel.identifier} P.${portNum}.`);
        }
    }
  }
  console.log(` ${createdMappings.length} mapeamentos criados para Patch Panel "${panel.identifier}".`);
  return createdMappings;
}

// --- Função Principal de Geração ---

export async function seedDatabase() {
  console.log("Iniciando o processo de seeding do banco de dados...");
  toast.info("Iniciando a geração de dados de exemplo...");

  try {
    // *** Verificação de Dados Existentes ***
    const existingRacks = await getRacks();
    if (existingRacks.length > 0) {
        const message = `Já existem ${existingRacks.length} racks no banco de dados. Para evitar duplicatas, limpe os dados existentes antes de popular novamente.`;
        console.warn(message);
        toast.warning(message, { duration: 10000 }); // Mostra por mais tempo
        return; // Aborta a função
    }
    // *** Fim da Verificação ***

    // 1. Gerar Racks
    const racks = await generateRacks(NUM_RACKS_TO_CREATE);
    if (racks.length === 0) {
        console.log("Nenhum rack foi criado. Abortando o seeding.");
        toast.error("Falha ao criar racks iniciais. Seeding abortado.");
        return;
    }

    // 2. Gerar Equipamentos para cada Rack
    let allEquipment: Equipment[] = [];
    for (const rack of racks) {
      const equipment = await generateEquipmentForRack(rack);
      allEquipment = allEquipment.concat(equipment);
    }

    // 3. Gerar Mapeamentos para cada Patch Panel
    const patchPanels = allEquipment.filter(eq => eq.equipment_type === 'PATCH_PANEL');
    let totalMappings = 0;
    for (const panel of patchPanels) {
      const mappings = await generatePortMappingsForPanel(panel);
      totalMappings += mappings.length;
    }

    console.log("\n--- Resumo do Seeding ---");
    console.log(` Racks criados: ${racks.length}`);
    console.log(` Equipamentos criados: ${allEquipment.length}`);
    console.log(`   - Switches: ${allEquipment.filter(eq => eq.equipment_type === 'SWITCH').length}`);
    console.log(`   - Patch Panels: ${patchPanels.length}`);
    console.log(` Mapeamentos de porta criados: ${totalMappings}`);
    console.log("-------------------------\n");

    toast.success(`Seeding concluído! ${racks.length} racks, ${allEquipment.length} equipamentos e ${totalMappings} mapeamentos criados.`);
    console.log("Seeding do banco de dados concluído com sucesso!");

  } catch (error) {
    console.error("Erro geral durante o processo de seeding:", error);
    toast.error("Ocorreu um erro geral durante o seeding.");
  }
}

// --- Tipos para Progresso ---
export interface ProgressUpdateData {
  currentStep: string;
  currentStepIndex: number; // 0-based index of the step being started or just finished
  totalSteps: number;
  error?: string | null;
  isComplete?: boolean;
}

export type ProgressCallback = (data: ProgressUpdateData) => void;


// --- Função para Limpar Dados Gerados (CUIDADO!) ---
export async function clearGeneratedData(onProgressUpdate?: ProgressCallback) {
    const totalSteps = 3; // 1: Mapeamentos, 2: Equipamentos, 3: Racks
    const reportProgress = (stepIndex: number, stepName: string, error: string | null = null, isComplete: boolean = false) => {
        onProgressUpdate?.({
            currentStep: stepName,
            currentStepIndex: stepIndex,
            totalSteps: totalSteps,
            error: error ?? undefined,
            isComplete: isComplete,
        });
        if (error) {
            console.error(`Erro na etapa ${stepIndex + 1} (${stepName}):`, error);
            toast.error(`Erro ao limpar ${stepName.toLowerCase()}.`);
        } else if (!isComplete) {
             console.log(`Iniciando etapa ${stepIndex + 1}/${totalSteps}: ${stepName}...`);
             toast.info(`Limpando ${stepName.toLowerCase()}...`);
        }
    };

    console.warn("ATENÇÃO: Iniciando a limpeza de TODOS os dados (Racks, Equipamentos, Mapeamentos)...");
    reportProgress(0, "Iniciando limpeza"); // Etapa inicial

    try {
        // Ordem inversa da criação para respeitar constraints
        reportProgress(0, "Mapeamentos de Porta");
        console.log("Excluindo todos os mapeamentos de porta...");
        // Não temos uma função getAllPortMappings, então precisamos buscar por painel ou iterar
        // Alternativa mais simples (mas potencialmente lenta): buscar todos os painéis e depois excluir mapeamentos
        const allRacks = await getRacks();
        let deletedMappings = 0;
        for (const rack of allRacks) {
            const equipmentInRack = await getEquipmentByRackId(rack.id);
            const panelsInRack = equipmentInRack.filter(eq => eq.equipment_type === 'PATCH_PANEL');
            for (const panel of panelsInRack) {
                // Precisamos buscar os mapeamentos para obter os IDs
                 const { data: mappings, error } = await supabase
                    .from('port_mappings')
                    .select('id')
                    .eq('patch_panel_id', panel.id);

                 if (error) {
                     console.error(`Erro ao buscar mapeamentos para painel ${panel.id}:`, error);
                     continue; // Pula para o próximo painel
                 }
                 if (mappings) {
                     for (const mapping of mappings) {
                         try {
                             await deletePortMapping(mapping.id);
                             deletedMappings++;
                         } catch (delError) {
                             console.error(`Erro ao excluir mapeamento ${mapping.id}:`, delError);
                         }
                     }
                 }
            }
        }
        console.log(`${deletedMappings} mapeamentos excluídos.`);
        console.log(`${deletedMappings} mapeamentos excluídos.`);
        // toast.info(`${deletedMappings} mapeamentos excluídos.`); // Removido para evitar muitos toasts

        reportProgress(1, "Equipamentos");
        console.log("Excluindo todos os equipamentos...");
        let deletedEquipment = 0;
        // Rebusca racks e equipamentos caso algo tenha mudado
         const currentRacks = await getRacks();
         for (const rack of currentRacks) {
             const equipmentInRack = await getEquipmentByRackId(rack.id);
             for (const equip of equipmentInRack) {
                 try {
                     await deleteEquipment(equip.id);
                     deletedEquipment++;
                 } catch (delError) {
                     console.error(`Erro ao excluir equipamento ${equip.id}:`, delError);
                 }
             }
         }
        console.log(`${deletedEquipment} equipamentos excluídos.`);
        console.log(`${deletedEquipment} equipamentos excluídos.`);
        // toast.info(`${deletedEquipment} equipamentos excluídos.`); // Removido para evitar muitos toasts

        reportProgress(2, "Racks");
        console.log("Excluindo todos os racks...");
        let deletedRacks = 0;
        const finalRacks = await getRacks(); // Busca racks novamente
        for (const rack of finalRacks) {
            try {
                await deleteRack(rack.id);
                deletedRacks++;
            } catch (delError) {
                console.error(`Erro ao excluir rack ${rack.id}:`, delError);
                // Se o erro for por conter equipamentos, algo deu errado na etapa anterior
                if (delError instanceof Error && delError.message.includes("contém")) {
                     toast.error(`Rack ${rack.id} ainda contém equipamentos. Limpeza incompleta.`);
                }
            }
        }
        console.log(`${deletedRacks} racks excluídos.`);
        console.log(`${deletedRacks} racks excluídos.`);
        // toast.info(`${deletedRacks} racks excluídos.`); // Removido para evitar muitos toasts

        console.log("Limpeza concluída.");
        reportProgress(totalSteps, "Concluído", null, true); // Sinaliza conclusão
        toast.success("Limpeza dos dados concluída.");

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Erro durante a limpeza dos dados:", errorMessage);
        reportProgress(totalSteps, "Erro", errorMessage, false); // Sinaliza erro
        // toast.error("Ocorreu um erro durante a limpeza dos dados."); // O reportProgress já faz isso
    }
}

// Adiciona referência ao supabase client para a função clearGeneratedData
import { supabase } from "@/integrations/supabase/client";
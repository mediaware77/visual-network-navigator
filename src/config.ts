/**
 * Configuração para ativar/desativar páginas do sistema.
 * Cada chave representa o nome de uma página, e o valor ('on' ou 'off') determina sua disponibilidade.
 * 
 * Para modificar a disponibilidade das páginas:
 * 1. Abra este arquivo em um editor de texto
 * 2. Altere o valor de qualquer entrada de página para 'on' ou 'off'
 * 3. Salve o arquivo - as mudanças terão efeito imediato sem necessidade de recompilação
 */
export const PageConfig = {
  // Página de Racks - /racks
  RacksPage: 'on',
  
  // Página de Equipamentos - /equipment
  EquipmentPage: 'on',
  
  // Página de Mapeamento de Portas - /port-mappings
  PortMappingsPage: 'on',
  
  // Página de Busca - /search
  SearchPage: 'on',
  
  // Página de Banco de Dados - /database
  DatabasePage: 'on',
  
  // Página de Configurações - /settings
  SettingsPage: 'on',
  
  // Página de Informações de Rede - Gerado através de QR CODE para equipamentos /network-info
  NetworkInfoPage: 'on',
  
  // Página de Informações de Porta - Gerado através de QR CODE - /port-info
  PortInfoPage: 'on'
};
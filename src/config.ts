/**
 * ARQUIVO DE CONFIGURAÇÃO DO SISTEMA VISUAL NETWORK NAVIGATOR
 * ==========================================================
 * 
 * Este arquivo pode ser editado manualmente após o deploy para ativar ou desativar
 * funcionalidades do sistema sem necessidade de recompilação.
 * 
 * INSTRUÇÕES PARA EDIÇÃO MANUAL EM PRODUÇÃO:
 * -----------------------------------------
 * 1. Localize este arquivo no diretório 'dist' após o build (config.js)
 * 2. Abra-o em qualquer editor de texto simples (Notepad, VS Code, etc.)
 * 3. Altere os valores conforme necessário (apenas 'on' ou 'off')
 * 4. Salve o arquivo e atualize a página do navegador
 * 5. As alterações terão efeito imediato sem necessidade de recompilação
 * 
 * IMPORTANTE:
 * - Mantenha a estrutura exata do arquivo
 * - Não altere os nomes das propriedades
 * - Use apenas os valores 'on' ou 'off'
 * - Não remova os comentários, eles servem como documentação
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
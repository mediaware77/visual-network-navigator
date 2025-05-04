/**
 * Declarações globais para TypeScript
 */

// Estende a interface Window para incluir a propriedade PageConfig
interface Window {
  PageConfig?: {
    RacksPage: 'on' | 'off';
    EquipmentPage: 'on' | 'off';
    PortMappingsPage: 'on' | 'off';
    SearchPage: 'on' | 'off';
    DatabasePage: 'on' | 'off';
    SettingsPage: 'on' | 'off';
    NetworkInfoPage: 'on' | 'off';
    PortInfoPage: 'on' | 'off';
  };
  loadConfig?: () => Promise<any>;
}
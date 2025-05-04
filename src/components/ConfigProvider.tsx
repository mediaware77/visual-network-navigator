import React, { createContext, useContext, useEffect, useState } from 'react';

// Tipo para a configuração
type PageConfigType = {
  RacksPage: 'on' | 'off';
  EquipmentPage: 'on' | 'off';
  PortMappingsPage: 'on' | 'off';
  SearchPage: 'on' | 'off';
  DatabasePage: 'on' | 'off';
  SettingsPage: 'on' | 'off';
  NetworkInfoPage: 'on' | 'off';
  PortInfoPage: 'on' | 'off';
};

// Contexto para a configuração
const ConfigContext = createContext<PageConfigType | null>(null);

// Hook para usar a configuração
export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
  }
  return config;
};

// Componente Provider
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PageConfigType | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para recarregar a configuração
  const reloadConfig = async () => {
    if (window.loadConfig) {
      const newConfig = await window.loadConfig();
      setConfig(newConfig);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carrega a configuração inicial
    reloadConfig();

    // Configura o listener para o evento de configuração carregada
    const handleConfigLoaded = () => {
      console.log('Configuração atualizada detectada');
      setConfig(window.PageConfig || null);
    };

    window.addEventListener('configLoaded', handleConfigLoaded);

    return () => {
      window.removeEventListener('configLoaded', handleConfigLoaded);
    };
  }, []);

  // Renderiza um loader enquanto a configuração está sendo carregada
  if (loading) {
    return <div>Carregando configuração...</div>;
  }

  // Renderiza os filhos com o contexto da configuração
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
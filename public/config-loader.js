/**
 * Script para carregar dinamicamente o arquivo de configuração
 * Este script permite que alterações no config.js sejam detectadas sem precisar reiniciar o servidor
 */

// Função para carregar o arquivo de configuração
async function loadConfig() {
  try {
    // Adiciona um parâmetro de timestamp para evitar cache
    const timestamp = new Date().getTime();
    const response = await fetch(`/config.js?t=${timestamp}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar configuração: ${response.status}`);
    }
    
    const configText = await response.text();
    
    // Remove a declaração de exportação para poder avaliar o código
    const configCode = configText.replace('export const PageConfig', 'window.PageConfig');
    
    // Cria um script e o executa para definir a configuração
    const script = document.createElement('script');
    script.textContent = configCode;
    document.head.appendChild(script);
    
    // Dispara um evento para notificar que a configuração foi carregada
    window.dispatchEvent(new CustomEvent('configLoaded'));
    
    console.log('Configuração carregada com sucesso');
    return window.PageConfig;
  } catch (error) {
    console.error('Falha ao carregar configuração:', error);
    return null;
  }
}

// Expõe a função para uso global
window.loadConfig = loadConfig;

// Carrega a configuração inicialmente
loadConfig();

// Recarrega a configuração a cada 5 segundos durante o desenvolvimento
setInterval(loadConfig, 5000);
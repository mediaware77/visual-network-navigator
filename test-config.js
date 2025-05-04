/**
 * Script para testar se o arquivo config.js está sendo carregado corretamente em produção
 * 
 * Para usar este script:
 * 1. Faça o build do projeto (npm run build)
 * 2. Inicie um servidor para o diretório dist (ex: npm run preview)
 * 3. Abra o console do navegador e verifique se o arquivo config.js está sendo carregado
 * 4. Modifique o arquivo dist/config.js manualmente
 * 5. Atualize a página e verifique se as alterações foram aplicadas
 */

// Este script pode ser executado no console do navegador para verificar
// se o arquivo config.js está sendo carregado corretamente

console.log('Verificando configuração do sistema...');

// Tenta acessar o objeto PageConfig que deve estar disponível globalmente
// se o arquivo config.js foi carregado corretamente
try {
  console.log('Configuração atual:', PageConfig);
  
  // Lista todas as páginas e seus status
  Object.entries(PageConfig).forEach(([page, status]) => {
    console.log(`${page}: ${status}`);
  });
  
  console.log('\nPara testar a edição manual do arquivo config.js:');
  console.log('1. Edite o arquivo dist/config.js');
  console.log('2. Altere algum valor de "on" para "off" ou vice-versa');
  console.log('3. Salve o arquivo e atualize esta página');
  console.log('4. Execute este script novamente para verificar as alterações');
} catch (error) {
  console.error('Erro ao acessar a configuração:', error);
  console.error('Verifique se o arquivo config.js está sendo carregado corretamente');
}
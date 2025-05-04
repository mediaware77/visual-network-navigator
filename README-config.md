# Configuração Manual em Produção

## Sobre o Arquivo de Configuração

O Visual Network Navigator utiliza um arquivo de configuração especial (`config.js`) que pode ser editado manualmente em produção sem necessidade de recompilação do código. Este arquivo controla quais páginas e funcionalidades estão disponíveis no sistema.

## Como Funciona

1. Durante o processo de build, o arquivo `src/config.ts` é compilado e copiado para o diretório `dist` como `config.js`
2. Este arquivo é mantido em formato legível e editável (não minificado)
3. Os comentários são preservados para facilitar a edição manual
4. A aplicação carrega este arquivo em tempo de execução

## Editando a Configuração em Produção

Para modificar as configurações após o deploy:

1. Localize o arquivo `config.js` no diretório de produção (geralmente em `/dist`)
2. Abra-o em qualquer editor de texto simples (Notepad, VS Code, etc.)
3. Altere os valores conforme necessário (apenas `'on'` ou `'off'`)
4. Salve o arquivo
5. Atualize a página do navegador para aplicar as alterações

## Exemplo de Configuração

```javascript
export const PageConfig = {
  // Página de Racks - /racks
  RacksPage: 'on',
  
  // Página de Equipamentos - /equipment
  EquipmentPage: 'on',
  
  // Desativar esta página alterando para 'off'
  PortMappingsPage: 'off',
};
```

## Importante

- Mantenha a estrutura exata do arquivo
- Não altere os nomes das propriedades
- Use apenas os valores `'on'` ou `'off'`
- Não remova os comentários, eles servem como documentação
- Não é necessário recompilar ou reiniciar o servidor após as alterações

## Verificando as Alterações

Para verificar se suas alterações foram aplicadas corretamente:

1. Abra o console do navegador (F12 ou Ctrl+Shift+I)
2. Digite `console.log(PageConfig)` e pressione Enter
3. Verifique se os valores exibidos correspondem às suas alterações

## Solução de Problemas

Se as alterações não estiverem sendo aplicadas:

1. Verifique se você está editando o arquivo correto no diretório de produção
2. Certifique-se de que o arquivo foi salvo corretamente
3. Limpe o cache do navegador e recarregue a página
4. Verifique se não há erros de sintaxe no arquivo (como vírgulas faltando)
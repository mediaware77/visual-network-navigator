# VisualNet

<!-- 
Logotipo: A Mediaware usa um logotipo de texto com a fonte MuseoModerno Bold. 
Você pode tentar criar uma versão em imagem disso ou simplesmente usar o nome em destaque. 
Se tiver uma imagem, descomente a linha abaixo.
-->
<!-- ![Mediaware Logo](URL_DO_LOGO_MEDIAWARE_OU_VISUALNET) -->

[![Versão](https://img.shields.io/badge/version-v0.0.0-blue)](https://github.com/mediaware77/visual-network-navigator/releases)
<!-- [![Status do Build](https://img.shields.io/github/actions/workflow/status/mediaware77/visual-network-navigator/[ARQUIVO_WORKFLOW.yml]?branch=main)](https://github.com/mediaware77/visual-network-navigator/actions) -->
<!-- [![Cobertura de Testes](https://img.shields.io/codecov/c/github/mediaware77/visual-network-navigator)]([LINK_PARA_CODECOV_SE_USAR]) -->
[![Licença](https://img.shields.io/badge/license-Não%20Definida-lightgrey)](LICENSE) <!-- Atualizar quando definida -->

> **VisualNet**: Uma ferramenta intuitiva para navegação, análise e visualização de redes e infraestrutura de TI. Desenvolvido pela Mediaware.

O VisualNet permite explorar visualmente a disposição de equipamentos em racks, mapear conexões de portas, identificar ativos de rede e entender a topologia física e lógica de forma interativa. Simplifica o gerenciamento de inventário de rede, o planejamento de capacidade e o diagnóstico de conectividade.

**Principais Tecnologias:**
*   **Linguagem Principal:** TypeScript
*   **Framework Frontend:** React (com Vite)
*   **UI/Estilização:** Tailwind CSS, shadcn/ui (utilizando Radix UI e Lucide Icons)
*   **Backend &amp; Banco de Dados:** Supabase (BaaS com PostgreSQL)
*   **Visualização/Gráficos:** Recharts (para possíveis gráficos e métricas)
*   **Gerenciamento de Dados Frontend:** Tanstack Query (@tanstack/react-query)
*   **Roteamento:** React Router DOM
*   **Processamento Local (Potencial):** SQL.js

---

## 1. Visão Geral

O VisualNet foi criado pela [Mediaware](https://github.com/mediaware77) para fornecer a engenheiros de rede, administradores de sistemas e equipes de TI uma maneira centralizada e visual de gerenciar e entender sua infraestrutura física e lógica. Seja para mapear um data center, documentar a rede de um escritório ou visualizar conexões complexas, o VisualNet oferece clareza, acesso rápido à informação e capacidade de gerenciamento interativo.

<!-- Opcional: Insira um diagrama de arquitetura simplificado aqui, se relevante -->
<!-- ![Arquitetura VisualNet](URL_DIAGRAMA_ARQUITETURA) -->

---

## 2. Requisitos de Sistema

### 2.1. Sistemas Operacionais Compatíveis (Desenvolvimento/Execução Local)
*   **Linux:** Distribuições modernas (Ex: Ubuntu 20.04+, Fedora 36+)
*   **macOS:** 11 Big Sur ou superior
*   **Windows:** 10/11 (WSL2 recomendado para melhor compatibilidade com ferramentas de desenvolvimento)

### 2.2. Dependências de Software
*   **Navegador Web Moderno:** Chrome 90+, Firefox 88+, Edge 91+, Safari 15+ (para acessar a interface)
*   **Node.js:** Versão `18.x` ou superior (Verifique com `node -v`)
*   **Gerenciador de Pacotes:** `npm` (v9+) ou `bun` (v1.0+)
*   **(Opcional) Supabase CLI:** Necessário se você planeja executar e gerenciar uma instância local do Supabase para desenvolvimento. [Instruções de Instalação](https://supabase.com/docs/guides/cli)

### 2.3. Requisitos de Hardware
*   **Mínimo:** 4GB RAM, CPU 2-Core, Placa de vídeo com suporte básico a WebGL.
*   **Recomendado:** 8GB+ RAM, CPU 4-Core, Placa de vídeo dedicada (especialmente se visualizar redes muito grandes ou complexas).

### 2.4. Permissões Necessárias
*   Acesso de leitura/escrita ao diretório do projeto para instalação de dependências (`node_modules`).
*   Permissões de rede para conectar-se à instância do Supabase (seja ela remota na nuvem ou local).

---

## 3. Instalação

Siga estas etapas para configurar o ambiente de desenvolvimento local.

### 3.1. Configuração do Projeto
1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/mediaware77/visual-network-navigator.git
    cd visual-network-navigator
    ```
2.  **Instale as Dependências:** É recomendado usar `bun` se disponível, pois um `bun.lockb` está presente. Caso contrário, use `npm`.
    ```bash
    bun install
    ```
    *Ou, se não estiver usando Bun:*
    ```bash
    npm install
    ```
3.  **Configure as Variáveis de Ambiente:**
    *   Crie um arquivo chamado `.env` na raiz do projeto.
    *   Copie o conteúdo de `.env.example` (se existir) para o seu `.env`, ou adicione as variáveis essenciais manualmente (veja a seção *Configuração Inicial* abaixo).
    *   **Importante:** Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com as credenciais do seu projeto Supabase. Estas são necessárias para que o frontend se conecte ao backend.

### 3.2. Configuração do Backend (Supabase)
*   **Opção 1: Usar Supabase Cloud (Recomendado para Início Rápido):**
    *   Crie um projeto em [supabase.com](https://supabase.com/).
    *   Vá para as configurações do projeto (Project Settings > API).
    *   Copie a `URL` e a chave `anon` (public) para as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no seu arquivo `.env`.
    *   Aplique as migrações do banco de dados (localizadas em `supabase/migrations`) ao seu projeto na nuvem, se necessário (pode ser feito via Supabase CLI ou manualmente no editor SQL do Supabase).
*   **Opção 2: Usar Supabase Localmente (Requer Supabase CLI):**
    *   Certifique-se de ter a [Supabase CLI](https://supabase.com/docs/guides/cli) instalada e o Docker rodando.
    *   Navegue até o diretório `supabase/` dentro do projeto.
    *   Inicie os serviços do Supabase:
        ```bash
        supabase start
        ```
    *   Após iniciar, a CLI exibirá as credenciais locais (API URL, anon key, etc.). Copie a URL e a chave `anon` para o seu arquivo `.env` na raiz do projeto.
    *   As migrações em `supabase/migrations` devem ser aplicadas automaticamente ao iniciar.

### 3.3. Iniciando a Aplicação Frontend
1.  **Execute o Servidor de Desenvolvimento:**
    ```bash
    bun run dev
    ```
    *Ou, se não estiver usando Bun:*
    ```bash
    npm run dev
    ```
2.  **Acesse no Navegador:** Abra seu navegador e vá para `http://localhost:8080` (ou a porta especificada na configuração do Vite ou na variável `PORT` do `.env`).

### 3.4. Verificação da Instalação
*   A interface do VisualNet deve carregar no navegador.
*   Verifique o console do desenvolvedor (F12) para quaisquer erros, especialmente relacionados à conexão com o Supabase.
*   Tente navegar pelas diferentes seções da aplicação.

---

## 4. Configuração Inicial

### 4.1. Arquivos de Configuração Principais
*   `.env`: (Não versionado) Armazena segredos e configurações específicas da instância (chaves Supabase, porta, etc.). Deve ser criado manualmente ou a partir de um `.env.example`.
*   `supabase/config.toml`: Configuração específica do projeto Supabase para a CLI.
*   `vite.config.ts`: Configuração do builder e servidor de desenvolvimento Vite.
*   `tailwind.config.ts`, `postcss.config.js`: Configurações de estilo e CSS.

### 4.2. Variáveis de Ambiente Essenciais (`.env`)
Estas variáveis precisam ser definidas no arquivo `.env` na raiz do projeto para que a aplicação funcione corretamente. O prefixo `VITE_` é exigido pelo Vite para expor variáveis ao código do frontend.

| Variável             | Descrição                                       | Obrigatório | Exemplo de Valor                         |
| :------------------- | :---------------------------------------------- | :---------- | :--------------------------------------- |
| `VITE_SUPABASE_URL`  | A URL da sua instância do Supabase.             | **Sim**     | `https://<id_projeto>.supabase.co`       |
| `VITE_SUPABASE_ANON_KEY` | A chave pública (anônima) da sua instância Supabase. | **Sim**     | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `PORT`               | (Opcional) Porta para o servidor de dev Vite.   | Não         | `8080` (Padrão do `vite.config.ts`)      |
| `LOG_LEVEL`          | (Opcional) Nível de log (se implementado).      | Não         | `INFO`, `DEBUG`                          |

### 4.3. Exemplo de Configuração (`.env`)
```dotenv
# Configuração para conectar a um projeto Supabase na nuvem
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Opcional: Definir uma porta diferente para o dev server
# PORT=3000
```

---

## 5. Guia de Uso (Introdução)

*(Esta seção deve ser expandida com screenshots e detalhes à medida que a aplicação amadurece)*

### 5.1. Acessando a Interface
*   Após iniciar o servidor de desenvolvimento (`bun run dev` ou `npm run dev`), acesse `http://localhost:8080` (ou a porta configurada).

### 5.2. Navegação Principal
*   Utilize a **barra lateral (sidebar)** para navegar entre as principais seções da aplicação, como:
    *   Dashboard/Visão Geral
    *   Racks
    *   Equipamentos
    *   Mapeamento de Portas
    *   Pesquisa
    *   Configurações

### 5.3. Visualizando Racks
*   Na seção "Racks", você pode ver uma representação visual dos racks de servidores/rede.
*   Clique em um rack para ver detalhes ou os equipamentos contidos nele.

### 5.4. Gerenciando Equipamentos
*   A seção "Equipamentos" lista os dispositivos de rede e servidores.
*   É possível adicionar, editar ou remover equipamentos.
*   Clicar em um equipamento pode mostrar seus detalhes, incluindo portas e conexões.

### 5.5. Mapeamento de Portas
*   Visualize e gerencie as conexões entre as portas dos equipamentos.
*   Ferramentas interativas podem permitir traçar conexões ou identificar portas disponíveis.

---

## 6. Funcionalidades Avançadas

*(Detalhes a serem adicionados conforme a implementação)*

*   **Layouts de Visualização:** (Se aplicável) Opções para diferentes formas de visualizar a rede ou os racks.
*   **Exportação de Dados/Visualizações:** Capacidade de exportar diagramas (PNG, SVG) ou dados (CSV, JSON).
*   **Cálculo de Métricas:** (Se aplicável) Análise de utilização de portas, capacidade de rack, etc.
*   **Personalização da Interface:** Temas (claro/escuro), opções de visualização.

---

## 7. API (se aplicável)

Atualmente, o VisualNet utiliza a API gerada automaticamente pelo Supabase para interações com o banco de dados. Não há uma API pública customizada exposta pela aplicação frontend em si.

*   **Referência da API Supabase:** Consulte a documentação do Supabase e a seção "API Docs" no painel do seu projeto Supabase para detalhes sobre os endpoints e métodos disponíveis para as tabelas do seu banco de dados.
*   **Autenticação:** A interação com a API Supabase a partir do frontend é feita usando a `anon key` (chave anônima pública) configurada. Políticas de Segurança em Nível de Linha (RLS) devem ser configuradas no Supabase para controlar o acesso aos dados.

---

## 8. Solução de Problemas (Troubleshooting)

### 8.1. FAQs (Perguntas Frequentes)
*   **P: A aplicação não carrega ou mostra erros de conexão.**
    *   **R:** Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no seu arquivo `.env` estão corretas e correspondem ao seu projeto Supabase. Confirme se sua instância Supabase (local ou na nuvem) está em execução e acessível. Verifique o console do navegador (F12) por erros detalhados.
*   **P: A visualização está lenta ou travando.**
    *   **R:** Certifique-se de que seu sistema atende aos requisitos de hardware recomendados, especialmente se estiver visualizando uma grande quantidade de dados. Feche outras aplicações que consomem muitos recursos. Verifique se os drivers da sua placa de vídeo estão atualizados.
*   **P: Como atualizo o esquema do banco de dados localmente?**
    *   **R:** Use a Supabase CLI. Crie novas migrações em `supabase/migrations` e aplique-as com `supabase db push` (cuidado, isso pode resetar dados locais se não for gerenciado corretamente) ou gerencie através de `supabase migration up`.

### 8.2. Erros Comuns e Soluções
*   **Erro:** `Failed to fetch` ou erros de CORS no console do navegador.
    *   **Causa:** Problema de rede, Supabase offline, URL incorreta no `.env`, ou configuração de CORS ausente/incorreta no Supabase (geralmente gerenciado automaticamente, mas pode ocorrer em configurações complexas).
    *   **Solução:** Verifique a conexão de rede, o status do Supabase, a exatidão das URLs no `.env` e as configurações de CORS no painel do Supabase se necessário.
*   **Erro:** Problemas de renderização visual ou erros de WebGL.
    *   **Causa:** Navegador desatualizado, drivers de vídeo desatualizados, hardware insuficiente.
    *   **Solução:** Atualize o navegador e os drivers da placa de vídeo. Tente em outro navegador. Verifique os requisitos de hardware.

### 8.3. Diagnóstico
*   **Console do Desenvolvedor do Navegador (F12):** Essencial para ver logs do frontend, erros de JavaScript e detalhes de requisições de rede (abas Console e Network).
*   **Logs do Supabase (Local):** Se estiver usando Supabase localmente, use `docker logs <container_id_ou_nome>` para ver logs dos diferentes serviços (kong, postgres, etc.).
*   **Painel do Supabase (Cloud):** Verifique os logs da API e do banco de dados diretamente no painel do seu projeto Supabase.

### 8.4. Canais de Suporte
*   **Issues do GitHub:** Para reportar bugs detalhados ou sugerir novas funcionalidades: [https://github.com/mediaware77/visual-network-navigator/issues](https://github.com/mediaware77/visual-network-navigator/issues)
*   *(Adicionar outros canais se existirem, como um fórum ou chat)*

> **Ao reportar um problema:** Inclua a versão do VisualNet (se aplicável, ou commit hash), seu Sistema Operacional, Navegador (com versão), etapas claras para reproduzir o erro, o comportamento esperado vs. o observado, capturas de tela relevantes e logs do console/backend.

---

## 9. Contribuição e Desenvolvimento

Agradecemos o interesse em contribuir para o VisualNet!

### 9.1. Guia para Contribuidores
*   No momento, não há um guia formal (`CONTRIBUTING.md`). Se você deseja contribuir, por favor, comece abrindo uma **Issue** no GitHub para discutir a mudança que você gostaria de fazer (seja um bug fix ou uma nova feature).
*   **Padrões de Código:** Siga os padrões existentes no código. Utilize o linter (`npm run lint` ou `bun run lint`) para verificar seu código.
*   **Commits:** Tente seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit.
*   **Pull Requests:** Abra Pull Requests direcionados ao branch `main` (ou a um branch de desenvolvimento, se definido). Descreva claramente as mudanças feitas no PR.

### 9.2. Estrutura do Código (Visão Geral)
```
/
├── public/             # Arquivos estáticos servidos diretamente
├── src/                # Código fonte da aplicação React/TypeScript
│   ├── components/     # Componentes reutilizáveis da UI (incluindo shadcn/ui)
│   ├── hooks/          # Hooks React customizados
│   ├── integrations/   # Lógica de integração com serviços externos (ex: Supabase)
│   ├── lib/            # Funções utilitárias e lógica compartilhada
│   ├── pages/          # Componentes que representam as páginas/rotas da aplicação
│   ├── App.tsx         # Componente raiz da aplicação (configura roteamento, layout)
│   ├── main.tsx        # Ponto de entrada da aplicação (renderiza App.tsx)
│   └── index.css       # Estilos globais (Tailwind)
├── supabase/           # Configuração e migrações do Supabase (para Supabase CLI)
│   ├── migrations/     # Migrações SQL do banco de dados
│   └── config.toml     # Configuração do projeto Supabase
├── .env.example        # (Opcional/Recomendado) Template para o arquivo .env
├── .gitignore          # Arquivos ignorados pelo Git
├── package.json        # Dependências e scripts do projeto (npm/bun)
├── bun.lockb           # Lockfile do Bun
├── tsconfig.json       # Configuração do TypeScript
├── vite.config.ts      # Configuração do Vite
└── README.md           # Este arquivo
```

### 9.3. Processo de Build e Testes
*   **Instalar Dependências:** `bun install` ou `npm install`
*   **Rodar em Modo Desenvolvimento:** `bun run dev` ou `npm run dev`
*   **Linting:** `bun run lint` ou `npm run lint`
*   **Construir para Produção:** `bun run build` ou `npm run build`
*   **Preview do Build de Produção:** `bun run preview` ou `npm run preview`
*   **Testes:** *(Comandos de teste a serem definidos se/quando testes forem implementados)*

---

## 10. Licença e Atribuições

### 10.1. Licença
Este projeto **ainda não possui uma licença de código aberto definida**. Todos os direitos são reservados à Mediaware até que uma licença seja explicitamente adicionada ao repositório (arquivo `LICENSE`).

### 10.2. Créditos e Reconhecimentos
*   Desenvolvido pela equipe da [Mediaware](https://github.com/mediaware77).
*   Interface construída com [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/).
*   Backend e persistência de dados providos por [Supabase](https://supabase.com/).
*   Ícones fornecidos por [Lucide Icons](https://lucide.dev/).
*   Gráficos/Visualizações (potencialmente) por [Recharts](https://recharts.org/).
*   Gerenciamento de estado de servidor com [Tanstack Query](https://tanstack.com/query/latest).
*   Roteamento por [React Router DOM](https://reactrouter.com/).

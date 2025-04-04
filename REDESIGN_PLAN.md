# Plano de Redesenho "Vibrante, Divertido e Icônico" para Visual Network Navigator

Este documento descreve o plano para redesenhar a interface do usuário do projeto `visual-network-navigator`, com o objetivo de criar uma experiência mais vibrante, feliz, divertida e visualmente estimulante.

## Objetivos Principais

*   Implementar uma paleta de cores rica e multicolorida (pastéis vibrantes).
*   Utilizar um par de fontes que combine ludicidade e clareza (Pacifico para títulos, Poppins para corpo).
*   Incorporar iconografia mais estilizada e divertida (Remix Icon).
*   Aumentar o arredondamento dos elementos para um visual mais suave.
*   Focar nos elementos principais da UI e nos componentes específicos de visualização de rede.

## Plano Detalhado

1.  **Configuração das Fontes:**
    *   Integrar "Poppins" (corpo) e "Pacifico" (títulos) via Google Fonts (importação no `src/index.css` ou link no `index.html`).
    *   Atualizar `tailwind.config.ts`:
        *   `fontFamily.sans`: `['Poppins', 'sans-serif']`
        *   `fontFamily.display`: `['Pacifico', 'cursive']` (nova adição)
    *   Aplicar `font-sans` globalmente no `body` (`src/index.css`).
    *   Aplicar `font-display` nos títulos principais (`h1`, `h2`, etc.) nas páginas e componentes.

2.  **Definição e Aplicação da Nova Paleta de Cores (Pastéis Vibrantes):**
    *   Definir HSL/Hex para as cores base (exemplos):
        *   `--primary`: Turquesa (ex: `hsl(174, 72%, 56%)`)
        *   `--primary-foreground`: Branco/Cinza muito claro
        *   `--secondary`: Coral (ex: `hsl(16, 100%, 70%)`)
        *   `--secondary-foreground`: Cinza escuro/Preto
        *   `--accent`: Amarelo-Sol (ex: `hsl(45, 100%, 60%)`)
        *   `--accent-foreground`: Cinza escuro/Preto
        *   `--background`: Branco/Off-white muito claro
        *   `--foreground`: Cinza escuro
        *   `--card`, `--popover`: Tom pastel muito suave
        *   `--border`, `--input`: Cinza claro ou pastel dessaturado
        *   `--ring`: `--primary` (Turquesa)
        *   `--destructive`: Vermelho/Rosa vibrante compatível
    *   Atualizar as variáveis CSS em `:root` e `.dark` (se mantido) no `src/index.css`.
    *   Atualizar as variáveis `--sidebar-*` com a nova paleta.

3.  **Ajuste do Arredondamento:**
    *   Aumentar o valor de `--radius` em `src/index.css` (ex: de `0.5rem` para `0.8rem` ou `1rem`).

4.  **Integração dos Ícones Remix Icon:**
    *   Instalar a biblioteca `remixicon-react` (ou `remixicon`).
    *   (Opcional) Desinstalar `lucide-react` após a substituição completa.

5.  **Aplicação e Refinamento nos Componentes:**
    *   **Foco:** `Layout`, `AppSidebar`, `Button`, `Card`, `Input`, `Dialog`, `RackView`, `EquipmentView`, `PortGrid`, e outros componentes `ui` relevantes.
    *   Aplicar as novas cores, fontes e arredondamento via classes Tailwind e CSS personalizado.
    *   Substituir os componentes de ícone `<LucideIcon ... />` pelos correspondentes `<RemixIcon ... />` (ex: `<RiHomeLine />`, `<RiSettings3Line />`).
    *   Revisar e atualizar as classes CSS personalizadas em `src/index.css` (linhas ~89-131) para usar as novas cores (`bg-primary`, `bg-accent`, `bg-muted`, etc.) e garantir contraste.

6.  **Teste Visual:**
    *   Navegar pelas páginas principais (`Index`, `EquipmentPage`, `RacksPage`, etc.) para verificar a consistência visual, legibilidade e a nova estética.

## Diagrama do Fluxo

```mermaid
graph TD
    subgraph Definição e Preparação
        A[1. Configurar Fontes Poppins/Pacifico]
        B[2. Definir Paleta Pastel Vibrante (CSS Vars)]
        C[3. Aumentar Arredondamento (CSS Var)]
        NEW[4. Integrar Remix Icon]
    end

    subgraph Aplicação
        D[5a. Aplicar Estilos e Ícones em Elementos UI]
        E[5b. Aplicar Estilos e Ícones em Componentes de Visualização]
    end

    subgraph Verificação
        F[6. Testar Visualmente nas Páginas]
    end

    A --> B --> C --> NEW --> D --> E --> F
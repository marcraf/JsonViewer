# Feature Specification: JSON Tree Visualizer

**Feature Branch**: `[001-json-tree-visualizer]`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "cria um sistema que permita colocar um json ao clicar em formatarar deverar organizar esse terxto em um texto formatado json e a possivilidade de visualizar esse json em uma estrutura em formato de Objeto. Arvore com todos os objetos , array, nodes, etc. será utilizado pelo usuario para melhor entendimento da estrutura do json."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Formatação de JSON (Priority: P1)

O usuário acessa o sistema, insere um texto JSON bruto e desconfigurado em uma área de entrada de texto e clica em "Formatar". O sistema valida a estrutura do JSON e exibe o texto organizado com indentação de 2 espaços e destaque sintático (colorização). Caso o JSON seja inválido, o sistema exibe um aviso claro sobre o erro de sintaxe.

**Why this priority**: É a funcionalidade básica essencial do sistema. Sem a capacidade de receber, validar e organizar o JSON em formato texto, o usuário não pode interagir com a estrutura de dados.

**Independent Test**: Pode ser testado independentemente inserindo uma string JSON desorganizada em uma única linha e verificando se ela é reordenada com recuo e cores apropriadas após o clique em formatar.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela do formatador com um JSON desorganizado mas válido colado no campo de entrada, **When** clica no botão "Formatar", **Then** o texto é substituído por sua versão formatada com 2 espaços de recuo e destaque visual.
2. **Given** que o usuário colou um texto inválido (ex.: faltam aspas em chaves), **When** clica no botão "Formatar", **Then** o sistema não quebra e exibe uma caixa de erro indicando o local aproximado do erro de parse.

---

### User Story 2 - Visualização em Árvore de Objetos (Priority: P2)

O usuário deseja visualizar o JSON formatado em uma estrutura de árvore interativa composta por nós (nodes), objetos e arrays. Cada nó correspondente a objetos e arrays pode ser expandido ou recolhido ao clicar em um ícone de seta. Chaves e valores são exibidos separadamente com formatação de cores específica para tipos de dados (string, número, boolean, nulo).

**Why this priority**: É o diferencial e foco da necessidade do usuário para melhor compreensão visual de estruturas de dados complexas ou aninhadas.

**Independent Test**: Pode ser verificado colando um JSON com múltiplos níveis de aninhamento e clicando na visualização em árvore, confirmando que setas expansíveis abrem e fecham os blocos internos de dados e que strings e números têm cores visivelmente distintas.

**Acceptance Scenarios**:

1. **Given** que um JSON válido de múltiplos níveis foi formatado, **When** o usuário acessa a aba "Visualização em Árvore", **Then** os nós raiz são exibidos e o usuário pode clicar em chaves expansíveis para revelar nós filhos.
2. **Given** a árvore de objetos renderizada, **When** o usuário clica no botão "Recolher Todos", **Then** todos os subnós de nível maior que 1 são ocultados de uma só vez.

---

### User Story 3 - Busca e Filtro de Nós na Árvore (Priority: P3)

O usuário deseja localizar rapidamente chaves ou valores dentro de um JSON complexo contendo centenas de linhas. Ele digita um termo no campo de busca e a árvore destaca visualmente todos os nós que contêm a palavra digitada, permitindo também expandir automaticamente os nós pai até a correspondência encontrada.

**Why this priority**: Melhora a eficiência no manuseio de payloads corporativos extensos (como retornos de APIs complexas), economizando tempo de rolagem e busca manual.

**Independent Test**: Pode ser validado carregando um JSON grande, pesquisando por uma chave específica aninhada que estava oculta (recolhida) e verificando se o nó pai correspondente se expande e a chave em questão fica com fundo destacado.

**Acceptance Scenarios**:

1. **Given** que a visualização em árvore de um JSON complexo está aberta, **When** o usuário insere o termo "id" no campo de busca, **Then** todos os nós que contêm "id" no nome da chave ou valor têm seu texto destacado em amarelo.

### Edge Cases

- **JSON Extremamente Grande (ex.: > 5MB)**: Usar renderização virtualizada (virtual list layout) e renderizar apenas os nós visíveis na tela para garantir performance ideal e evitar travamentos no navegador.
- **JSON com Referência Circular**: O sistema não deve entrar em loop infinito ao gerar a árvore. Deve detectar e renderizar um aviso indicando referência circular no nó específico.
- **Caracteres Especiais e Escape**: Chaves ou valores com aspas escapadas ou quebras de linha incorporadas devem ser processados sem desconfigurar a árvore visual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST fornecer uma área de entrada de texto (textarea) para colagem do JSON bruto pelo usuário.
- **FR-002**: O sistema MUST fornecer um botão "Formatar" que processe o input e atualize o editor com a version formatada (indentação de 2 espaços).
- **FR-003**: O sistema MUST validar sintaticamente o JSON usando um mecanismo seguro de parse e capturar exceções para exibir mensagens de erro amigáveis sem travar a interface.
- **FR-004**: O sistema MUST renderizar uma visualização hierárquica interativa (árvore de objetos) para qualquer JSON válido estruturado.
- **FR-005**: Cada nó do tipo Objeto (`{}`) ou Array (`[]`) na visualização em árvore MUST conter um controle interativo (seta/ícone) para expandir ou recolher seus nós internos.
- **FR-006**: O sistema MUST colorir os tipos de dados do JSON de acordo com um esquema visual definido (ex.: strings em verde, números em azul, booleans em laranja, null/undefined em cinza escuro).
- **FR-007**: O sistema MUST fornecer botões globais para "Expandir Todos" e "Recolher Todos" os nós da visualização em árvore.
- **FR-008**: O sistema MUST fornecer um campo de filtro que permita buscar chaves ou valores na árvore de objetos e destacar os resultados encontrados.
- **FR-009**: O sistema MUST ser integrado como uma ferramenta de utilidade na barra lateral (Sidebar) do painel administrativo, sob o Shell de Layout Unificado.

### Key Entities *(include if feature involves data)*

- **JSON Node**: Representa um elemento atômico na estrutura de dados (chave, valor, tipo de dado, nível de aninhamento e estado de expansão).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue colar, formatar e visualizar a árvore de um JSON típico de API de até 500KB em menos de 2 segundos.
- **SC-002**: Erros de formatação de JSON devem ser exibidos de forma clara em menos de 500ms a partir do clique em formatar.
- **SC-003**: 100% dos nós colapsáveis devem responder ao clique de expansão/recolhimento instantaneamente (menos de 50ms).
- **SC-004**: A ferramenta de busca deve destacar todas as chaves correspondentes na árvore em menos de 100ms após a digitação do termo.

## Assumptions

- O processamento de formatação e geração da árvore será realizado inteiramente no lado do cliente (browser) para assegurar privacidade e evitar tráfego de rede desnecessário.
- O Design System e as cores da interface seguirão as especificações definidas na Constituição do projeto (usando Tailwind e shadcn/ui).
- O visualizador de JSON será projetado de forma responsiva para se ajustar a dispositivos móveis, convertendo a visualização lateral em um fluxo vertical.

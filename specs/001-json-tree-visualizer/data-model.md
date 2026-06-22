# Data Model and State: JSON Tree Visualizer

## 1. Estrutura de Estado da Feature (useJsonVisualizer State)

```typescript
interface JsonVisualizerState {
  rawInput: string;            // O texto JSON bruto digitado ou colado
  parsedJson: any;            // O objeto JavaScript resultante do parse (ou null se inválido)
  error: {
    message: string;          // Mensagem de erro amigável para o usuário
    line?: number;            // Linha aproximada do erro (se detectada)
    column?: number;          // Coluna aproximada do erro (se detectada)
  } | null;
  searchQuery: string;        // O termo de busca atual para filtrar na árvore
  expandedNodes: Record<string, boolean>; // Mapa de paths de nós (ex: "root.users[0].name") para o estado de expansão (expanded = true/false)
  viewMode: 'editor' | 'tree'; // Modo de visualização ativo (texto ou árvore)
}
```

## 2. Representação do Nó de Árvore (TreeNode)

Durante a renderização recursiva, cada nó da árvore é processado a partir das propriedades abaixo:

```typescript
interface TreeNodeProps {
  nodeKey: string;            // A chave do nó (ex: "id", "name", ou "0" para arrays)
  value: any;                 // O valor associado ao nó
  path: string;               // O caminho único do nó desde a raiz (usado como chave de expansão)
  depth: number;              // O nível de profundidade na árvore (multiplicado por recuo CSS)
  searchQuery: string;        // O termo de busca atual para realce visual
}
```

### Regras de Mapeamento de Tipos para Visualização

O componente `JsonTreeNode` mapeia o tipo do valor para decidir a renderização:

- **Object (`typeof value === 'object' && value !== null && !Array.isArray(value)`)**:
  - Exibe `{}`
  - Nó colapsável
  - Se expandido, renderiza recursivamente chaves filhas
- **Array (`Array.isArray(value)`)**:
  - Exibe `[]` com a quantidade de itens (ex: `[12 itens]`)
  - Nó colapsável
  - Se expandido, renderiza recursivamente os itens usando seus índices como chave
- **String (`typeof value === 'string'`)**:
  - Exibe com aspas (ex: `"João"`)
  - Cor: Verde (`text-green-600` no modo claro, `text-green-400` no modo escuro)
- **Number (`typeof value === 'number'`)**:
  - Exibe o valor numérico puro
  - Cor: Azul (`text-blue-600` / `text-blue-400`)
- **Boolean (`typeof value === 'boolean'`)**:
  - Exibe `true` ou `false`
  - Cor: Laranja (`text-orange-600` / `text-orange-400`)
- **Null (`value === null`)**:
  - Exibe `null`
  - Cor: Cinza (`text-gray-500`)

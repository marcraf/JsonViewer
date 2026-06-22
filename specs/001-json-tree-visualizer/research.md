# Technical Research: JSON Tree Visualizer

## 1. JSON Parsing and Error Reporting

### Decision
Utilizar a função nativa do navegador `JSON.parse` encapsulada em um bloco `try/catch` para detecção inicial. Para prover mensagens de erro amigáveis com indicação precisa da linha/coluna, utilizaremos um parser auxiliar leve em JavaScript se o parse nativo falhar, ou extrairemos as coordenadas do erro a partir da mensagem gerada pela exceção do `JSON.parse`.

### Rationale
O parser nativo é extremamente rápido (implementado em código nativo pelo motor do browser) e consome poucos recursos. Em caso de falhas, a mensagem da exceção nos browsers modernos fornece a posição do caractere (ex.: "at position 42"), o que permite mapear facilmente a linha e coluna no editor de texto para indicar o erro ao usuário de forma visual.

### Alternatives Considered
- **Uso de parsers complexos (ex: JSON5, Peggy)**: Descartados pelo tamanho de bundle e overhead de processamento desnecessários, visto que o input padrão esperado é JSON estrito e padronizado.

---

## 2. Renderização da Árvore de Objetos (JSON Tree)

### Decision
Adotar um componente recursivo composto (`JsonTreeNode`) que recebe uma chave, um valor e o nível de aninhamento atual. Para otimização de performance com JSONs grandes:
1. Nós recolhidos não renderizarão seus filhos no DOM (lazy evaluation).
2. Se o número total de chaves expandidas ultrapassar 1000, utilizaremos técnicas de divisão de rendering via React Transitions (`useTransition` e `DeferredValue`) para manter a thread principal do navegador desobstruída.

### Rationale
A renderização recursiva é o padrão mais legível e intuitivo para estruturas de árvore. O Lazy Evaluation (não renderizar filhos de nós fechados) garante que mesmo documentos massivos sejam abertos de forma instantânea caso comecem em estado colapsado.

### Alternatives Considered
- **Renderização Flat List com Virtualização Completa**: Oferece maior performance para árvores com milhares de nós simultaneamente abertos, mas introduz complexidade no cálculo de alturas de nós expansíveis. Será avaliada como extensão futura se necessário.

---

## 3. Mecanismo de Busca e Filtro

### Decision
A busca na árvore utilizará um algoritmo de travessia em profundidade (DFS) que percorre o objeto JSON em memória e marca os nós correspondentes com uma flag `isMatched: true` e força a expansão automática dos nós pai (`isExpanded: true`) para revelar os matches. Um hook personalizado `useDebounce` limitará a busca a disparar 300ms após o término da digitação do usuário.

### Rationale
Isso previne que a árvore seja recalculada a cada tecla digitada (evitando lag de digitação) e garante que o usuário veja imediatamente o termo destacado mesmo que ele esteja aninhado no fundo da estrutura.

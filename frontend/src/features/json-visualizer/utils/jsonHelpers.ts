export interface ParseError {
  message: string;
  line?: number;
  column?: number;
}

export function parseJson(text: string): { data: any; error: ParseError | null } {
  if (!text.trim()) {
    return { data: null, error: null };
  }
  try {
    const data = JSON.parse(text);
    return { data, error: null };
  } catch (err: any) {
    const message = err.message || 'Erro desconhecido de sintaxe JSON';
    let line: number | undefined;
    let column: number | undefined;

    // Tenta encontrar "line X column Y"
    const lineColMatch = message.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    } else {
      // Tenta encontrar "at position X"
      const posMatch = message.match(/at position (\d+)/i);
      if (posMatch) {
        const position = parseInt(posMatch[1], 10);
        const subText = text.substring(0, position);
        const lines = subText.split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }
    }

    return {
      data: null,
      error: { message, line, column }
    };
  }
}

export function formatJson(value: any): string {
  if (value === undefined) return '';
  return JSON.stringify(value, null, 2);
}

export function isExpandable(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

export function getDataType(value: any): 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'undefined' {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value as any;
}

/**
 * Faz uma busca em profundidade (DFS) no objeto JSON para encontrar caminhos que combinam com o termo de busca.
 * Retorna um conjunto de caminhos únicos (paths) que devem ser expandidos para exibir os resultados encontrados.
 */
export function searchJsonPaths(
  value: any,
  query: string,
  currentPath: string = 'root',
  matchedPaths: Set<string> = new Set(),
  pathsToExpand: Set<string> = new Set()
): { matchedPaths: Set<string>; pathsToExpand: Set<string> } {
  if (!query.trim()) {
    return { matchedPaths, pathsToExpand };
  }

  const queryLower = query.toLowerCase();

  // Verifica se a chave do nó atual bate com a busca
  const segments = currentPath.split('.');
  const lastSegment = segments[segments.length - 1] || '';
  if (lastSegment.toLowerCase().includes(queryLower)) {
    matchedPaths.add(currentPath);
    // Adiciona caminhos pai para expansão
    for (let i = 1; i < segments.length; i++) {
      pathsToExpand.add(segments.slice(0, i).join('.'));
    }
  }

  const type = getDataType(value);

  if (type === 'object') {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const nextPath = `${currentPath}.${key}`;
        searchJsonPaths(value[key], query, nextPath, matchedPaths, pathsToExpand);
      }
    }
  } else if (type === 'array') {
    (value as any[]).forEach((item, index) => {
      const nextPath = `${currentPath}[${index}]`;
      searchJsonPaths(item, query, nextPath, matchedPaths, pathsToExpand);
    });
  } else {
    // Para valores primitivos
    const strValue = String(value).toLowerCase();
    if (strValue.includes(queryLower)) {
      matchedPaths.add(currentPath);
      // Adiciona caminhos pai para expansão
      for (let i = 1; i < segments.length; i++) {
        pathsToExpand.add(segments.slice(0, i).join('.'));
      }
    }
  }

  return { matchedPaths, pathsToExpand };
}

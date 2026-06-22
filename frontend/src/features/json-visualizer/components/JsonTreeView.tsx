import React, { useState, useEffect } from 'react';
import { JsonTreeNode } from './JsonTreeNode';
import { getDataType } from '../utils/jsonHelpers';
import type { ParseError } from '../utils/jsonHelpers';

interface JsonTreeViewProps {
  data: any;
  expandedNodes: Record<string, boolean>;
  onToggle: (path: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  error: ParseError | null;
  onBack: () => void;
  selectedPath: string | null;
  selectedVal: any;
  onSelect: (path: string, val: any) => void;
  hasSelectionHistory: boolean;
  onGoBackSelection: () => void;
}

function formatShortValue(val: any, type: string): string {
  if (type === 'object') return '{...}';
  if (type === 'array') return `[...] (${val.length} itens)`;
  if (type === 'string') return `"${val}"`;
  if (type === 'null') return 'null';
  return String(val);
}

function formatPrimitiveValue(val: any, type: string): string {
  if (type === 'string') return `"${val}"`;
  if (type === 'null') return 'null';
  return String(val);
}

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({
  data,
  expandedNodes,
  onToggle,
  onExpandAll,
  onCollapseAll,
  searchQuery,
  onSearchQueryChange,
  error,
  onBack,
  selectedPath,
  selectedVal,
  onSelect,
  hasSelectionHistory,
  onGoBackSelection
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce da busca
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchQueryChange(localSearch);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, onSearchQueryChange]);

  const renderDetailContent = () => {
    if (!selectedPath) {
      return (
        <div style={{ color: 'var(--jv-text-muted)', textAlign: 'center', padding: '60px 20px', fontSize: '0.9rem' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🔍</div>
          Nenhum elemento selecionado.<br />
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            Clique em uma chave ou valor na árvore para ver os detalhes agrupados aqui.
          </span>
        </div>
      );
    }

    const type = getDataType(selectedVal);

    const handleCopyPath = async () => {
      try {
        await navigator.clipboard.writeText(selectedPath);
      } catch (err) {
        console.error('Falha ao copiar caminho: ', err);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--jv-text-muted)', fontWeight: 600 }}>
              Caminho Selecionado
            </span>
            <button className="jv-btn jv-btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={handleCopyPath}>
              Copiar Caminho
            </button>
          </div>
          <code style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontFamily: 'var(--jv-font-mono)',
            wordBreak: 'break-all',
            color: 'var(--jv-color-key)',
            border: '1px solid var(--jv-border-glass)'
          }}>
            {selectedPath}
          </code>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--jv-text-muted)', fontWeight: 600 }}>Tipo</span>
            <span className={`jv-val-${type}`} style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {type}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--jv-text-muted)', fontWeight: 600 }}>Tamanho / Elementos</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {type === 'object' ? `${Object.keys(selectedVal).length} chaves` :
               type === 'array' ? `${selectedVal.length} itens` : '1 (Primitivo)'}
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--jv-border-glass)', margin: '0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--jv-text-main)' }}>
              {type === 'object' || type === 'array' ? 'Valores Agrupados (Conteúdo Direto)' : 'Valor do Elemento'}
            </span>
            {hasSelectionHistory && (
              <button 
                className="jv-btn jv-btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.75rem' }} 
                onClick={onGoBackSelection}
              >
                ← Voltar
              </button>
            )}
          </div>

          {type === 'object' ? (
            Object.keys(selectedVal).length === 0 ? (
              <div style={{ color: 'var(--jv-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Objeto vazio {}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="jv-detail-table">
                  <thead>
                    <tr>
                      <th>Chave</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(selectedVal).map((key) => {
                      const childVal = selectedVal[key];
                      const childType = getDataType(childVal);
                      return (
                        <tr key={key} onClick={() => onSelect(`${selectedPath}.${key}`, childVal)}>
                          <td style={{ fontFamily: 'var(--jv-font-mono)', color: 'var(--jv-color-key)', fontWeight: 550 }}>{key}</td>
                          <td className={`jv-val-${childType}`} style={{ fontSize: '0.85rem' }}>{childType}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {formatShortValue(childVal, childType)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : type === 'array' ? (
            selectedVal.length === 0 ? (
              <div style={{ color: 'var(--jv-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Array vazio []
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="jv-detail-table">
                  <thead>
                    <tr>
                      <th>Índice</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVal.map((item: any, idx: number) => {
                      const childType = getDataType(item);
                      return (
                        <tr key={idx} onClick={() => onSelect(`${selectedPath}[${idx}]`, item)}>
                          <td style={{ fontFamily: 'var(--jv-font-mono)', color: 'var(--jv-text-muted)' }}>[{idx}]</td>
                          <td className={`jv-val-${childType}`} style={{ fontSize: '0.85rem' }}>{childType}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {formatShortValue(item, childType)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'var(--jv-font-mono)',
                fontSize: '0.9rem',
                border: '1px solid var(--jv-border-glass)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {formatPrimitiveValue(selectedVal, type)}
              </div>
              <button
                className="jv-btn jv-btn-secondary"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => navigator.clipboard.writeText(String(selectedVal))}
              >
                Copiar Valor
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="jv-tree-layout">
      {/* Coluna da Esquerda: Árvore de Objetos */}
      <div className="jv-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="jv-btn jv-btn-secondary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Voltar ao Editor
            </button>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 650 }}>Árvore de Objetos</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="jv-btn jv-btn-secondary" onClick={onCollapseAll} disabled={!!error || !data}>
              Recolher Todos
            </button>
            <button className="jv-btn jv-btn-secondary" onClick={onExpandAll} disabled={!!error || !data}>
              Expandir Todos
            </button>
          </div>
        </div>

        <div className="jv-search-bar">
          <input
            type="text"
            className="jv-input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filtrar chaves ou valores... (ex: nome, id)"
            disabled={!!error || !data}
          />
          {localSearch && (
            <button className="jv-btn jv-btn-secondary" onClick={() => setLocalSearch('')}>
              Limpar
            </button>
          )}
        </div>

        <div className="jv-tree-container">
          {error ? (
            <div className="jv-error-alert" role="alert" style={{ marginTop: 0 }}>
              <div className="jv-error-title">
                <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Não é possível renderizar a árvore
              </div>
              <div>Corrija os erros no <strong>Editor JSON</strong> para visualizar a árvore.</div>
              <div style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.9 }}>{error.message}</div>
            </div>
          ) : data !== null && data !== undefined ? (
            <JsonTreeNode
              nodeKey="root"
              value={data}
              path="root"
              depth={0}
              searchQuery={searchQuery}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ) : (
            <div style={{ color: 'var(--jv-text-muted)', textAlign: 'center', padding: '40px 0' }}>
              Nenhum dado para exibir. Volte ao <strong>Editor JSON</strong> para colar seu JSON.
            </div>
          )}
        </div>
      </div>

      {/* Coluna da Direita: Painel de Detalhes */}
      <div className="jv-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 650 }}>Valores do Elemento</h3>
        <div style={{ flex: 1 }}>
          {renderDetailContent()}
        </div>
      </div>
    </div>
  );
};

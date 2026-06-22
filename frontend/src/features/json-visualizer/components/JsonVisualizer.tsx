import React from 'react';
import { useJsonVisualizer } from '../hooks/useJsonVisualizer';
import { JsonInputArea } from './JsonInputArea';
import { JsonTreeView } from './JsonTreeView';
import '../styles/json-visualizer.css';

interface JsonVisualizerProps {
  initialValue?: string;
}

const DEFAULT_JSON = `{
  "projeto": "JSON Tree Visualizer",
  "versao": "1.5.0",
  "autor": "Antigravity IDE",
  "funcionalidades": [
    "Formatacao de JSON",
    "Arvore interativa de objetos",
    "Busca com realce visual",
    "Suporte responsivo"
  ],
  "configuracoes": {
    "ativo": true,
    "tema": "dark",
    "maxSizeLimit": 5242880
  },
  "historico": null
}`;

export const JsonVisualizer: React.FC<JsonVisualizerProps> = ({
  initialValue = DEFAULT_JSON
}) => {
  const {
    rawInput,
    parsedJson,
    error,
    searchQuery,
    expandedNodes,
    step,
    setRawInput,
    formatInput,
    goToVisualizer,
    goToInput,
    selectedPath,
    selectedVal,
    selectNode,
    selectionHistory,
    goBackSelection,
    setSearchQuery,
    toggleNode,
    expandAll,
    collapseAll
  } = useJsonVisualizer(initialValue);

  return (
    <div className="jv-container">
      <header className="jv-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="jv-title">JSON Tree Visualizer & Formatter</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--jv-text-muted)' }}>
            Visualizador e Formatador de Estrutura de Dados
          </div>
        </div>
      </header>

      <main className="jv-main-layout" style={{ gridTemplateColumns: '1fr', padding: '24px' }}>
        {step === 'visualizer' ? (
          <JsonTreeView
            data={parsedJson}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            error={error}
            onBack={goToInput}
            selectedPath={selectedPath}
            selectedVal={selectedVal}
            onSelect={selectNode}
            hasSelectionHistory={selectionHistory.length > 0}
            onGoBackSelection={goBackSelection}
          />
        ) : (
          <JsonInputArea
            value={rawInput}
            onChange={setRawInput}
            onFormat={formatInput}
            onProceed={goToVisualizer}
            error={error}
          />
        )}
      </main>
    </div>
  );
};
export default JsonVisualizer;

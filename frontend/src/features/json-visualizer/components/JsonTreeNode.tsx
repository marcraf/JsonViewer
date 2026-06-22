import React from 'react';
import { getDataType, isExpandable } from '../utils/jsonHelpers';

interface JsonTreeNodeProps {
  nodeKey: string;
  value: any;
  path: string;
  depth: number;
  searchQuery: string;
  expandedNodes: Record<string, boolean>;
  onToggle: (path: string) => void;
  selectedPath: string | null;
  onSelect: (path: string, val: any) => void;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="jv-highlight">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

export const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  nodeKey,
  value,
  path,
  depth,
  searchQuery,
  expandedNodes,
  onToggle,
  selectedPath,
  onSelect
}) => {
  const type = getDataType(value);
  const expandable = isExpandable(value);
  const isExpanded = expandedNodes[path] ?? false;
  const isSelected = path === selectedPath;

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(path, value);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandable) {
      onToggle(path);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandable) {
      onToggle(path);
    }
  };

  const renderValue = () => {
    switch (type) {
      case 'string':
        return <span className="jv-val-string">"{highlightText(value, searchQuery)}"</span>;
      case 'number':
        return <span className="jv-val-number">{highlightText(String(value), searchQuery)}</span>;
      case 'boolean':
        return <span className="jv-val-boolean">{highlightText(String(value), searchQuery)}</span>;
      case 'null':
        return <span className="jv-val-null">null</span>;
      case 'array':
        return <span className="jv-val-null">{`[${value.length} itens]`}</span>;
      case 'object':
        return <span className="jv-val-null">{`{${Object.keys(value).length} chaves}`}</span>;
      default:
        return <span>{String(value)}</span>;
    }
  };

  const renderChildren = () => {
    if (!expandable || !isExpanded) return null;

    if (type === 'array') {
      return (value as any[]).map((item, index) => {
        const childPath = `${path}[${index}]`;
        return (
          <JsonTreeNode
            key={childPath}
            nodeKey={String(index)}
            value={item}
            path={childPath}
            depth={depth + 1}
            searchQuery={searchQuery}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        );
      });
    }

    if (type === 'object') {
      return Object.keys(value).map((key) => {
        const childPath = `${path}.${key}`;
        return (
          <JsonTreeNode
            key={childPath}
            nodeKey={key}
            value={value[key]}
            path={childPath}
            depth={depth + 1}
            searchQuery={searchQuery}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        );
      });
    }

    return null;
  };

  return (
    <div className="jv-tree-node" style={{ marginLeft: depth === 0 ? '0' : '16px' }}>
      <div className={`jv-node-header ${isSelected ? 'selected' : ''}`} onClick={handleHeaderClick} onDoubleClick={handleDoubleClick}>
        {expandable ? (
          <span className="jv-toggle-box" onClick={handleToggleClick}>
            {isExpanded ? '−' : '+'}
          </span>
        ) : (
          <span style={{ width: '14px', display: 'inline-block' }} />
        )}
        <span className="jv-key">{highlightText(nodeKey, searchQuery)}</span>
        <span style={{ color: 'var(--jv-text-muted)', margin: '0 4px' }}>:</span>
        {renderValue()}
      </div>
      {renderChildren()}
    </div>
  );
};

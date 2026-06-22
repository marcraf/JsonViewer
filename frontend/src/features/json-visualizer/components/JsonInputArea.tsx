import React, { useState } from 'react';
import type { ParseError } from '../utils/jsonHelpers';

interface JsonInputAreaProps {
  value: string;
  onChange: (text: string) => void;
  onFormat: () => boolean;
  onProceed: () => boolean;
  error: ParseError | null;
}

export const JsonInputArea: React.FC<JsonInputAreaProps> = ({
  value,
  onChange,
  onFormat,
  onProceed,
  error
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="jv-glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 650 }}>Entrada JSON Bruto</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="jv-btn jv-btn-secondary" onClick={handleClear} disabled={!value}>
            Limpar
          </button>
          <button className="jv-btn jv-btn-secondary" onClick={handleCopy} disabled={!value}>
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button className="jv-btn jv-btn-secondary" onClick={onFormat} disabled={!value}>
            Formatar
          </button>
        </div>
      </div>

      <textarea
        className="jv-textarea"
        style={{ height: '420px' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Cole seu JSON bruto aqui... Ex: {"nome": "Exemplo", "ativo": true}'
        spellCheck={false}
      />

      {error && (
        <div className="jv-error-alert" role="alert" style={{ marginTop: 0 }}>
          <div className="jv-error-title">
            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            JSON Inválido
          </div>
          <div>{error.message}</div>
          {(error.line !== undefined || error.column !== undefined) && (
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>
              Encontrado {error.line !== undefined ? `na linha ${error.line}` : ''}
              {error.column !== undefined ? `, coluna ${error.column}` : ''}
            </div>
          )}
        </div>
      )}

      <button
        className="jv-btn jv-btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '12px',
          fontSize: '1rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        }}
        onClick={onProceed}
        disabled={!value}
      >
        Visualizar Árvore de Objetos →
      </button>
    </div>
  );
};

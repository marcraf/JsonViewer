import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JsonVisualizer } from '../components/JsonVisualizer';
import '@testing-library/jest-dom';

describe('JsonVisualizer Component', () => {
  it('should render headers and editor area by default', () => {
    render(<JsonVisualizer initialValue='{"test": true}' />);
    
    expect(screen.getAllByText('JSON Tree Visualizer & Formatter')[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Cole seu JSON bruto/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Visualizar Árvore de Objetos →' })).toBeInTheDocument();
  });

  it('should format JSON on format button click', async () => {
    render(<JsonVisualizer initialValue='{"a":1}' />);
    
    const formatBtn = screen.getByText('Formatar');
    fireEvent.click(formatBtn);

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/Cole seu JSON bruto/i) as HTMLTextAreaElement;
      expect(textarea.value).toBe('{\n  "a": 1\n}');
    });
  });

  it('should display syntax errors for invalid JSON inputs', async () => {
    render(<JsonVisualizer initialValue='{"a":1' />);
    
    const formatBtn = screen.getByText('Formatar');
    fireEvent.click(formatBtn);

    await waitFor(() => {
      expect(screen.getByText('JSON Inválido')).toBeInTheDocument();
    });
  });

  it('should transition to tree, expand/collapse nodes, and go back to editor', async () => {
    render(<JsonVisualizer initialValue='{"address": {"city": "Berlin"}}' />);
    
    // Clica no botão para visualizar a árvore
    const proceedBtn = screen.getByRole('button', { name: 'Visualizar Árvore de Objetos →' });
    fireEvent.click(proceedBtn);

    // O nó address deve estar na tela
    const addressNode = screen.getByText('address');
    expect(addressNode).toBeInTheDocument();

    // city não deve estar visível pois por padrão começa recolhido
    expect(screen.queryByText('city')).toBeNull();

    // Clica no header do nó address para expandir (o botão ToggleBox '+' está presente)
    const toggleBtn = screen.getByText('+');
    fireEvent.click(toggleBtn);

    // Agora city deve aparecer na tela
    expect(screen.getByText('city')).toBeInTheDocument();
    expect(screen.getByText('"Berlin"')).toBeInTheDocument();

    // Clica no botão de voltar para retornar ao editor
    const backBtn = screen.getByRole('button', { name: '← Voltar ao Editor' });
    fireEvent.click(backBtn);

    // Deve mostrar o textarea novamente
    expect(screen.getByPlaceholderText(/Cole seu JSON bruto/i)).toBeInTheDocument();
  });

  it('should select a node and render its details in the right panel', async () => {
    render(<JsonVisualizer initialValue='{"config": {"theme": "dark"}}' />);
    
    // Clica no botão para visualizar a árvore
    const proceedBtn = screen.getByRole('button', { name: 'Visualizar Árvore de Objetos →' });
    fireEvent.click(proceedBtn);

    // O nó config deve estar visível
    const configNode = screen.getByText('config');
    expect(configNode).toBeInTheDocument();

    // Painel de detalhes inicialmente deve indicar que nenhum elemento está selecionado
    expect(screen.getByText(/Nenhum elemento selecionado/i)).toBeInTheDocument();

    // Seleciona o nó config ao clicar no seu texto/chave
    fireEvent.click(configNode);

    // O painel de detalhes deve agora mostrar as informações sobre "config"
    expect(screen.getByText('root.config')).toBeInTheDocument();
    expect(screen.getByText('object')).toBeInTheDocument();
    expect(screen.getByText('theme')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('"dark"')).toBeInTheDocument();
  });

  it('should select a node, navigate deep, and allow going back in selection history', async () => {
    render(<JsonVisualizer initialValue='{"config": {"server": {"port": 8080}}}' />);
    
    // Clica no botão para visualizar a árvore
    const proceedBtn = screen.getByRole('button', { name: 'Visualizar Árvore de Objetos →' });
    fireEvent.click(proceedBtn);

    // O nó config deve estar visível
    const configNode = screen.getByText('config');
    
    // Seleciona config
    fireEvent.click(configNode);
    expect(screen.getByText('root.config')).toBeInTheDocument();
    
    // O painel de detalhes deve exibir 'server' como uma chave do objeto
    const serverRow = screen.getByText('server');
    expect(serverRow).toBeInTheDocument();

    // Aprofunda selecionando 'server' através da linha clicável do painel de detalhes
    fireEvent.click(serverRow);

    // A seleção atual deve ter mudado para 'root.config.server'
    expect(screen.getByText('root.config.server')).toBeInTheDocument();

    // Deve exibir o botão "Voltar" do histórico
    const detailBackBtn = screen.getByRole('button', { name: '← Voltar' });
    expect(detailBackBtn).toBeInTheDocument();

    // Clica em "Voltar"
    fireEvent.click(detailBackBtn);

    // Deve retornar para a seleção anterior: "root.config"
    expect(screen.getByText('root.config')).toBeInTheDocument();
  });
});

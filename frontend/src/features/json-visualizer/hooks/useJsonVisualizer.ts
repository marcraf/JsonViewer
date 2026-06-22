import { useState, useEffect, useTransition } from 'react';
import type { JsonVisualizerState } from '../types';
import {
  parseJson,
  formatJson,
  getDataType,
  searchJsonPaths
} from '../utils/jsonHelpers';

function getObjectPaths(
  value: any,
  currentPath: string = 'root',
  paths: Record<string, boolean> = {}
): Record<string, boolean> {
  const type = getDataType(value);
  if (type === 'object') {
    paths[currentPath] = true;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        getObjectPaths(value[key], `${currentPath}.${key}`, paths);
      }
    }
  } else if (type === 'array') {
    paths[currentPath] = true;
    (value as any[]).forEach((item, index) => {
      getObjectPaths(item, `${currentPath}[${index}]`, paths);
    });
  }
  return paths;
}

export function useJsonVisualizer(initialInput: string = '') {
  const [state, setState] = useState<JsonVisualizerState>({
    rawInput: initialInput,
    parsedJson: null,
    error: null,
    searchQuery: '',
    expandedNodes: { root: true },
    step: 'input',
    selectedPath: null,
    selectedVal: null,
    selectionHistory: []
  });

  const [isSearching, startSearchTransition] = useTransition();

  // Faz o parse automático sempre que a entrada de texto mudar
  useEffect(() => {
    const { data, error } = parseJson(state.rawInput);
    setState((prev) => ({
      ...prev,
      parsedJson: data,
      error,
      selectedPath: null,
      selectedVal: null,
      selectionHistory: []
    }));
  }, [state.rawInput]);

  // Auto-expand matches when search query changes
  useEffect(() => {
    if (state.searchQuery.trim() && state.parsedJson) {
      startSearchTransition(() => {
        const { pathsToExpand } = searchJsonPaths(state.parsedJson, state.searchQuery);
        setState((prev) => {
          const newExpanded = { ...prev.expandedNodes };
          pathsToExpand.forEach((path) => {
            newExpanded[path] = true;
          });
          return {
            ...prev,
            expandedNodes: newExpanded
          };
        });
      });
    }
  }, [state.searchQuery, state.parsedJson]);

  const setRawInput = (text: string) => {
    setState((prev) => ({ ...prev, rawInput: text }));
  };

  const formatInput = () => {
    const { data, error } = parseJson(state.rawInput);
    if (error) {
      setState((prev) => ({ ...prev, error }));
      return false;
    }
    const formatted = formatJson(data);
    setState((prev) => ({
      ...prev,
      rawInput: formatted,
      parsedJson: data,
      error: null,
      selectedPath: null,
      selectedVal: null,
      selectionHistory: []
    }));
    return true;
  };

  const goToVisualizer = () => {
    const { data, error } = parseJson(state.rawInput);
    if (error) {
      setState((prev) => ({ ...prev, error }));
      return false;
    }
    setState((prev) => ({
      ...prev,
      parsedJson: data,
      error: null,
      step: 'visualizer',
      selectedPath: null,
      selectedVal: null,
      selectionHistory: []
    }));
    return true;
  };

  const goToInput = () => {
    setState((prev) => ({
      ...prev,
      step: 'input',
      selectedPath: null,
      selectedVal: null,
      selectionHistory: []
    }));
  };

  const selectNode = (path: string | null, val: any) => {
    setState((prev) => {
      if (path === null) {
        return {
          ...prev,
          selectedPath: null,
          selectedVal: null,
          selectionHistory: []
        };
      }
      
      if (prev.selectedPath === path) {
        return prev;
      }

      const newHistory = [...prev.selectionHistory];
      if (prev.selectedPath !== null) {
        newHistory.push({ path: prev.selectedPath, val: prev.selectedVal });
      }

      return {
        ...prev,
        selectedPath: path,
        selectedVal: val,
        selectionHistory: newHistory
      };
    });
  };

  const goBackSelection = () => {
    setState((prev) => {
      if (prev.selectionHistory.length === 0) return prev;
      const newHistory = [...prev.selectionHistory];
      const previous = newHistory.pop()!;
      return {
        ...prev,
        selectedPath: previous.path,
        selectedVal: previous.val,
        selectionHistory: newHistory
      };
    });
  };

  const setSearchQuery = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  };

  const toggleNode = (path: string) => {
    setState((prev) => {
      const isExpanded = prev.expandedNodes[path] ?? false;
      return {
        ...prev,
        expandedNodes: {
          ...prev.expandedNodes,
          [path]: !isExpanded
        }
      };
    });
  };

  const expandAll = () => {
    if (!state.parsedJson) return;
    const allPaths = getObjectPaths(state.parsedJson);
    setState((prev) => ({
      ...prev,
      expandedNodes: allPaths
    }));
  };

  const collapseAll = () => {
    setState((prev) => ({
      ...prev,
      expandedNodes: { root: true }
    }));
  };

  return {
    ...state,
    isSearching,
    setRawInput,
    formatInput,
    goToVisualizer,
    goToInput,
    selectNode,
    goBackSelection,
    setSearchQuery,
    toggleNode,
    expandAll,
    collapseAll
  };
}

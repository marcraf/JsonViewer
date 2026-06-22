export interface SelectionHistoryItem {
  path: string;
  val: any;
}

export interface JsonVisualizerState {
  rawInput: string;
  parsedJson: any;
  error: {
    message: string;
    line?: number;
    column?: number;
  } | null;
  searchQuery: string;
  expandedNodes: Record<string, boolean>;
  step: 'input' | 'visualizer';
  selectedPath: string | null;
  selectedVal: any;
  selectionHistory: SelectionHistoryItem[];
}

export interface TreeNodeProps {
  nodeKey: string;
  value: any;
  path: string;
  depth: number;
  searchQuery: string;
  onToggle: (path: string) => void;
  isExpanded: boolean;
}

interface MindmapNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export const mockDraggableNodes: MindmapNode[] = [
  { id: 'n1', label: 'Início do Atendimento', x: 200, y: 100 },
  { id: 'n2', label: 'Problema de Rede', x: 450, y: 50 },
  { id: 'n3', label: 'Problema de Hardware', x: 450, y: 150 },
  { id: 'n4', label: 'Verificar Cabo', x: 700, y: 25 },
  { id: 'n5', label: 'Ping OK', x: 950, y: 0 },
  { id: 'n6', label: 'Cabo Desligado', x: 950, y: 50 },
  { id: 'n7', label: 'Diagnóstico PC', x: 700, y: 175 },
  { id: 'n8', label: 'RESOLUÇÃO: Rede OK', x: 1200, y: 0 },
];
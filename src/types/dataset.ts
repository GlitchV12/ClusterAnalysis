export type VariableType =
  | 'numeric'
  | 'categorical'
  | 'binary'
  | 'ordinal'
  | 'datetime'
  | 'text'
  | 'identifier'
  | 'unknown';

export interface DatasetColumn {
  id: string;
  name: string;
  detectedType: VariableType;
  userType?: VariableType;
  missingCount: number;
  uniqueCount: number;
  isSelected: boolean;
}

export interface Dataset {
  id: string;
  fileName: string;
  data: Record<string, any>[];
  columns: DatasetColumn[];
  rowCount: number;
  colCount: number;
}

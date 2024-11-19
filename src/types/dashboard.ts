export type DashboardWidgetType = 
  | 'table' 
  | 'chart' 
  | 'card' 
  | 'text'
  | 'link'
  | 'filter'
  | 'kpi'
  | 'pivot';

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'area' 
  | 'scatter'
  | 'radar';

export interface DashboardFilter {
  id: string;
  fieldId: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: any;
}

export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  width: 1 | 2 | 3 | 4;
  height: 1 | 2 | 3;
  position: number;
  config: {
    formIds?: string[];
    fields?: string[];
    chartType?: ChartType;
    filters?: DashboardFilter[];
    groupBy?: string[];
    sortBy?: {
      field: string;
      order: 'asc' | 'desc';
    };
    format?: {
      numberFormat?: string;
      dateFormat?: string;
    };
    colors?: string[];
    // Nuevas propiedades para widgets de texto y enlaces
    content?: string;
    links?: Array<{
      text: string;
      url: string;
      icon?: string;
      color?: string;
    }>;
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    padding?: string;
  };
}
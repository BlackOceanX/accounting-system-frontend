export interface Document {
  name: string;
  code: string;
  due: string;
  amount: string;
  status: string;
}

export interface DashboardCard {
  title: string;
  filter: string[];
  valueLabel: string;
  value: string;
  chartType: 'pie' | 'bar' | 'line' | 'doc';
  emptyText?: string;
  button?: string;
  link?: string;
  valueLabel2?: string;
  value2?: string;
  chartColor?: string;
  chartLabel?: string;
  chartValue?: string;
  docList?: Document[];
}

export interface DashboardCardProps {
  card: DashboardCard;
} 
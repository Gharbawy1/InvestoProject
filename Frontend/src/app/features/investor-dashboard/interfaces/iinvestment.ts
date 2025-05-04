export interface Iinvestment {
  id: string;
  projectName: string;
  amount: number;
  date: string;
  status: 'active' | 'Pending' | 'completed';
  progress: number;
  returnRate: number;
}

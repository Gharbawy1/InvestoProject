export interface Iinvestment {
  id: string;
  projectName: string;
  amount: number;
  date: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  returnRate: number;
}

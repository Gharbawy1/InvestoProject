import { IInvestor } from '../../auth/interfaces/iinvestor';
import { IOffer } from './ioffer';

export interface IOfferProfile extends IOffer {
  offerDate: string;
  expirationDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  investor: IInvestor;
  categoryId: number;
  isPaid: boolean;
}

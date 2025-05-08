import { IInvestor } from '../../auth/interfaces/iinvestor';
import { IOffer } from './ioffer';

export interface IOfferProfile extends IOffer {
  offerId: number;
  offerDate: string;
  offerAmount: number;
  expirationDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  investor: IInvestor;
  categoryId: number;
}

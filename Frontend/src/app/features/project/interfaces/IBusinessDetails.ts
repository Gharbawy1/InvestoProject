import { IBusiness } from './IBusiness';

export interface IBusinessDetails
  extends Omit<IBusiness, 'projectImage' | 'categoryId' | 'ownerId'> {
  projectImageUrl: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
  categoryName: string;
  ownerId: string;
  ownerName: string;
  raisedFund: number;
  investorsCount: number;
}

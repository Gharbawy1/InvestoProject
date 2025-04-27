import { IBusiness } from '../../project/interfaces/IBusiness';

export interface IBusinessProfile
  extends Omit<IBusiness, 'categoryId' | 'ownerId'> {
  id: string;
  categoryName: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  owner: string;
}

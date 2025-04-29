import { IBusiness } from './IBusiness';

export interface IBusinessDetails
  extends Omit<IBusiness, 'projectImage' | 'categoryId' | 'ownerId'> {
  id: string;
  projectImageUrl: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
  categoryName: string;
  ownerId: string;
}

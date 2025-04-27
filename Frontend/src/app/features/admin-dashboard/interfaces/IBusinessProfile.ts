import { IBusiness } from '../../project/interfaces/IBusiness';

export interface IBusinessProfile extends IBusiness {
  id: string;
  category: string;
}

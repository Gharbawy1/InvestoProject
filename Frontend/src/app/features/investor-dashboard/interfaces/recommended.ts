import { IBusiness } from '../../project/interfaces/IBusiness';

export interface IRecommended
  extends Omit<
    IBusiness,
    | 'projectImage'
    | 'articlesOfAssociation'
    | 'commercialRegistryCertificate'
    | 'taxCard'
  > {
  projectImageUrl: string;
  status: string;
  categoryName: string;
  ownerName: string;
  raisedFund: number;
  investorsCount: number;
}

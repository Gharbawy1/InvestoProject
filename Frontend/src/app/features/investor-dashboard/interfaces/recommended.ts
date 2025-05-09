import { IBusiness } from '../../project/interfaces/IBusiness';

export interface IRecomended
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

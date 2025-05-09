import { IBusiness } from '../../project/interfaces/IBusiness';

export interface DashboardBusiness extends IBusiness {
  projectImageUrl: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  raisedFund: number;
  investorsCount: number;
  categoryName: string;
  ownerName: string;
  articlesOfAssociationUrl?: string | null;
  commercialRegistryCertificateUrl?: string | null;
  taxCardUrl?: string | null;
  textCardUrl?: string | null;
}

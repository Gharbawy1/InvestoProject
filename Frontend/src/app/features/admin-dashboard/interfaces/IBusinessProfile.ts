import { IBusiness } from '../../project/interfaces/IBusiness';

export interface IBusinessProfile
  extends Omit<
    IBusiness,
    | 'projectImage'
    | 'articlesOfAssociation'
    | 'commercialRegistryCertificate'
    | 'taxCard'
  > {
  projectImageURL: string;
  articlesOfAssociationURL: string;
  commercialRegistryCertificateURL: string;
  taxCardURL: string;
  categoryName: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  bio?: string | null;
  registrationDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePictureURL?: string;
  address?: string | null;
  nationalIDImageFrontURL?: string;
  nationalIDImageBackURL?: string;
  nationalID?: string;
}

import { IBusiness } from '../../project/interfaces/IBusiness';

export interface IBusinessProfile extends Omit<IBusiness, 'projectImage'> {
  id: string;
  projectImageURL: string;
  categoryName: string;
  status: string;
  bio: string | null;
  registrationDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureURL: string;
  address: string | null;
  nationalIDImageFrontURL: string;
  nationalIDImageBackURL: string;
  nationalID: string;
}

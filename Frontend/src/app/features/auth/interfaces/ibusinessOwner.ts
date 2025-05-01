import { IGuest } from './iguest';

export interface IBusinessOwner extends IGuest {
  NationalID: string;
  NationalIDImageFrontURL: File;
  NationalIDImageBackURL: File;
}

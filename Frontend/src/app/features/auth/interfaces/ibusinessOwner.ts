import { IGuest } from './iguest';

export interface IBusinessOwner extends IGuest {
  address: string;
  verificationIdentity: File;
}

import { IGuest } from "./iguest";

export interface IBusiness extends IGuest {
  address: string;
  verificationIdentity: string;
}

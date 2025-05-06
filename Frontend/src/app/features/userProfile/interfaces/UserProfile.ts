export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  registrationDate: string;
  profilePictureURL: string;
  bio: string | null;
  address: string | null;
  phoneNumber: string | null;
  roles: string[];
  nationalID: string;
}
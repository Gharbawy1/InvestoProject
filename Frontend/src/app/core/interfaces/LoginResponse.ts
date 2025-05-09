export interface LoginResponse {
  token: string;
  userId: string;
  firstName: string;
  lastName: string;
  roles: string[];
  profilePictureURL: string;
}

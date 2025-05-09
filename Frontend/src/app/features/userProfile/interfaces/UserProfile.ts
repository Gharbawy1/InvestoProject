export interface UserProfile {
  id: string | null;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  registrationDate: string;
  profilePictureURL: string;
  bio: string | null;
  address: string | null;
  phoneNumber: string;
}

export interface invesorUserProfile extends UserProfile {
  riskTolerance: string;
  investmentGoals: string;
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  accreditationStatus: string;
  netWorth: number;
  annualIncome: number;
}
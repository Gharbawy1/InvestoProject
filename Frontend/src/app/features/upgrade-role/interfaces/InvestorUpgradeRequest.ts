export interface InvestorUpgradeRequest {
  riskTolerance: string;
  investmentGoals: string;
  nationalIDImageFrontURL: string;
  nationalIDImageBackURL: string;
  nationalID: string;
  profilePictureURL: string;
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  accreditationStatus: string;
  netWorth: number;
  annualIncome: number;
}

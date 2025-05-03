export interface InvestorUpgradeRequest {
  RiskTolerance: string;
  InvestmentGoals: string;
  NationalIDImageFrontURL: string;
  NationalIDImageBackURL: string;
  NationalID: string;
  ProfilePictureURL: string;
  MinInvestmentAmount: number;
  MaxInvestmentAmount: number;
  AccreditationStatus: string;
  NetWorth: number;
  AnnualIncome: number;
}

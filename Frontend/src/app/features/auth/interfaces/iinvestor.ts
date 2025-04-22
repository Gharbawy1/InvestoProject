import { IGuest } from "./iguest";

export interface IInvestor extends IGuest {
  address: string;
  verificationIdentity: string;
  riskTolerance: string;
  investmentGoals: string;
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  accreditationStatus: string;
  netWorth: number;
  annualIncome: number;
}

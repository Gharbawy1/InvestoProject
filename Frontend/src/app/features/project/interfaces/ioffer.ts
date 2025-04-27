export interface IOffer {
  id: string;
  offerAmount: number;
  equityPercentage: number;
  profitShare: number;
  investmentType: string;
  offerTerms: string;
  status: string;
  additionalServices: string;
  offerDate: Date;
  expirationDate: Date;
  investorId: number;
  investor: {
    firstName: string;
    lastName: string;
  };
  projectId: number;
  projectTitle: string;
}

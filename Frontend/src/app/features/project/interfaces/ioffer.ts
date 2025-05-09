export interface IOffer {
  offerId?: number;
  offerAmount: number,
  investmentType: 'Equity' | 'Debt' | 'ProfitShare',
  equityPercentage: number,
  profitShare: number,
  offerTerms: string,
  projectId: number,
  investorId: string
}

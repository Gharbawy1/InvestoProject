export interface IBusiness{
  projectTitle: string;
  subtitle: string;
  projectLocation: string;
  fundingGoal: number;
  projectImage: File;
  fundingExchange: string;
  projectVision: string;
  projectStory: string;
  currentVision: string;
  goals: string;
  categoryId: number;
  status : 'approved' | 'rejected'| 'pending';
  submissionDate: string;
}
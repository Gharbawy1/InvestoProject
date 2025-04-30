export interface ArrayApiResponse<T> {
  data: T[];
  isValid: boolean;
  errorMessage: string | null;
}

export interface ObjectApiResponse<T> {
  data: T;
  isValid: boolean;
  errorMessage: string | null;
}

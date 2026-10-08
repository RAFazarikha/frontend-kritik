export interface Confess {
  id: string;
  from: string;
  to: string;
  message: string;
  category: string;
  rotation?: number;
  loveCount: number;
  createdAt: string;
}

export interface ConfessApiResponse {
  success: boolean;
  data: Confess[];
}
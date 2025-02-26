export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  refreshToken: string;
}

export interface PageReplacementRequest {
  pageRequests: number[];
  frameCount: number;
}

export interface PageReplacementResults {
  matrix: number[][];
  pageFaults: boolean[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  email: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface StorageStats {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  userCount: number;
}

export interface ApiError {
  message: string;
  status: number;
}
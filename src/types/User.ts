export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone?: string;
  profileImage?: string;
  roles: string[];
  loginProvider:string;
  applications?: [];
  appointments?: [];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInterface {
  user: User;
  tokens: Tokens;
}

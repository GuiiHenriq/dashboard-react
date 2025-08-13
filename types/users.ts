import { User as AuthUser } from './auth';

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support?: {
    url: string;
    text: string;
  };
}

export interface User extends AuthUser {
}

export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  job?: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  job?: string;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  job?: string;
}

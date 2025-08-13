import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth';
import { UsersResponse, CreateUserData, UpdateUserData } from '@/types/users';

const API_BASE = '/api/auth';
const USERS_API_BASE = '/api/users';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  private async usersRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<{ token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const userData = await this.getUserByEmail(credentials.email);

    return {
      token: response.token,
      user: userData,
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const registerResponse = await this.request<{ id: number; token: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        first_name: credentials.first_name,
        last_name: credentials.last_name,
      }),
    });

    const userData: User = {
      id: registerResponse.id,
      email: credentials.email,
      first_name: credentials.first_name,
      last_name: credentials.last_name,
      avatar: '',
    };

    return {
      token: registerResponse.token,
      user: userData,
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.request<User>(`/user/${encodeURIComponent(email)}`);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async getUsers(page: number = 1, per_page: number = 6): Promise<UsersResponse> {
    return this.usersRequest<UsersResponse>(`${USERS_API_BASE}?page=${page}&per_page=${per_page}`);
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.usersRequest<User>(USERS_API_BASE, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    return this.usersRequest<User>(`${USERS_API_BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<{ success: boolean }> {
    return this.usersRequest<{ success: boolean }>(`${USERS_API_BASE}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

export const authApi = {
  login: (credentials: LoginCredentials) => apiClient.login(credentials),
  register: (credentials: RegisterCredentials) => apiClient.register(credentials),
  getUserByEmail: (email: string) => apiClient.getUserByEmail(email),
};

export const usersApi = {
  getUsers: (page?: number, per_page?: number) => apiClient.getUsers(page, per_page),
  createUser: (userData: CreateUserData) => apiClient.createUser(userData),
  updateUser: (id: number, userData: UpdateUserData) => apiClient.updateUser(id, userData),
  deleteUser: (id: number) => apiClient.deleteUser(id),
};

export default apiClient;

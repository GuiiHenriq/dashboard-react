import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth';

const API_BASE = '/api/auth';

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
}

export const apiClient = new ApiClient();

export const authApi = {
  login: (credentials: LoginCredentials) => apiClient.login(credentials),
  register: (credentials: RegisterCredentials) => apiClient.register(credentials),
  getUserByEmail: (email: string) => apiClient.getUserByEmail(email),
};

export default apiClient;

import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { User, LoginCredentials } from '../../types/auth';

jest.mock('../../lib/api-client', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

jest.mock('../../lib/storage', () => ({
  storage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    getUser: jest.fn(),
    setUser: jest.fn(),
    clearAuth: jest.fn(),
  },
}));

import { useAuth } from '../../hooks/useAuth';
import { AuthProvider } from '../../lib/auth-context';
import { authApi } from '../../lib/api-client';
import { storage } from '../../lib/storage';

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockStorage = storage as jest.Mocked<typeof storage>;

const createWrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
};

const mockCredentials: LoginCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getToken.mockReturnValue(null);
    mockStorage.getUser.mockReturnValue(null);
  });

  it('should initialize with unauthenticated state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should login successfully', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'mock-token',
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login(mockCredentials);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(mockStorage.setToken).toHaveBeenCalledWith('mock-token');
    expect(mockStorage.setUser).toHaveBeenCalledWith(mockUser);
  });

  it('should logout correctly', async () => {
    mockStorage.getToken.mockReturnValue('mock-token');
    mockStorage.getUser.mockReturnValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(mockStorage.clearAuth).toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.login(mockCredentials);
      })
    ).rejects.toThrow('Invalid credentials');

    expect(result.current.isAuthenticated).toBe(false);
    expect(mockStorage.clearAuth).toHaveBeenCalled();
  });
});

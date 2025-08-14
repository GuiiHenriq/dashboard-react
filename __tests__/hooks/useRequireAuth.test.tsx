import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/auth';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const mockPush = jest.fn();

describe('useRequireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
  });

  it('should return loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useRequireAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isReady).toBe(false);
  });

  it('should redirect to login when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('should redirect to custom path when provided', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    renderHook(() => useRequireAuth('/custom/path'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/custom/path');
    });
  });

  it('should return ready state when user is authenticated', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      token: 'mock-token',
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const { result } = renderHook(() => useRequireAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isReady).toBe(true);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect when still loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    renderHook(() => useRequireAuth());

    expect(mockPush).not.toHaveBeenCalled();
  });
});

import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsers } from '../../hooks/useUsers';
import { usersApi } from '../../lib/api-client';
import { User, UsersResponse, CreateUserData, UpdateUserData } from '../../types/users';

jest.mock('../../lib/api-client', () => ({
  usersApi: {
    getUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

const mockUsersApi = usersApi as jest.Mocked<typeof usersApi>;

const mockUser: User = {
  id: 1,
  email: 'john@example.com',
  first_name: 'John',
  last_name: 'Doe',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
};

const mockUsersResponse: UsersResponse = {
  page: 1,
  per_page: 6,
  total: 12,
  total_pages: 2,
  data: [mockUser],
};

const mockCreateUserData: CreateUserData = {
  email: 'jane@example.com',
  first_name: 'Jane',
  last_name: 'Smith',
  job: 'Developer',
};

const mockUpdateUserData: UpdateUserData = {
  first_name: 'Johnny',
  last_name: 'Doe',
};

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state and fetch users on mount', async () => {
    mockUsersApi.getUsers.mockResolvedValue(mockUsersResponse);

    const { result } = renderHook(() => useUsers());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.users).toEqual([mockUser]);
    expect(result.current.pagination).toEqual({
      page: 1,
      per_page: 6,
      total: 12,
      total_pages: 2,
    });
    expect(mockUsersApi.getUsers).toHaveBeenCalledWith(1, 6);
  });

  it('should handle fetch users error', async () => {
    const errorMessage = 'Failed to fetch users';
    mockUsersApi.getUsers.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.users).toEqual([]);
  });

  it('should create a new user successfully', async () => {
    const emptyResponse = { ...mockUsersResponse, data: [] };
    mockUsersApi.getUsers.mockResolvedValue(emptyResponse);
    mockUsersApi.createUser.mockResolvedValue({
      email: mockCreateUserData.email,
      first_name: mockCreateUserData.first_name,
      last_name: mockCreateUserData.last_name,
    } as User);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let createdUser: User;
    await act(async () => {
      createdUser = await result.current.createUser(mockCreateUserData);
    });

    expect(createdUser!).toMatchObject({
      email: mockCreateUserData.email,
      first_name: mockCreateUserData.first_name,
      last_name: mockCreateUserData.last_name,
    });
    expect(result.current.users).toHaveLength(1);
    expect(mockUsersApi.createUser).toHaveBeenCalledWith(mockCreateUserData);
  });

  it('should update an existing user successfully', async () => {
    mockUsersApi.getUsers.mockResolvedValue(mockUsersResponse);
    mockUsersApi.updateUser.mockResolvedValue({
      ...mockUser,
      ...mockUpdateUserData,
    });

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateUser(1, mockUpdateUserData);
    });

    expect(result.current.users[0]).toMatchObject({
      id: 1,
      first_name: 'Johnny',
      last_name: 'Doe',
    });
    expect(mockUsersApi.updateUser).toHaveBeenCalledWith(1, mockUpdateUserData);
  });

  it('should delete a user successfully', async () => {
    mockUsersApi.getUsers.mockResolvedValue(mockUsersResponse);
    mockUsersApi.deleteUser.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(result.current.users).toHaveLength(0);
    expect(mockUsersApi.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should navigate to a valid page', async () => {
    const page2Response = { ...mockUsersResponse, page: 2 };
    mockUsersApi.getUsers
      .mockResolvedValueOnce(mockUsersResponse)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.goToPage(2);
    });

    await waitFor(() => {
      expect(result.current.pagination.page).toBe(2);
    });

    expect(mockUsersApi.getUsers).toHaveBeenCalledTimes(2);
    expect(mockUsersApi.getUsers).toHaveBeenLastCalledWith(2, 6);
  });

  it('should not navigate to invalid page numbers', async () => {
    mockUsersApi.getUsers.mockResolvedValue(mockUsersResponse);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToPage(0);
    });

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.pagination.page).toBe(1);
    expect(mockUsersApi.getUsers).toHaveBeenCalledTimes(1);
  });

  it('should initialize with custom initial page', async () => {
    const page2Response = { ...mockUsersResponse, page: 2 };
    mockUsersApi.getUsers.mockResolvedValue(page2Response);

    const { result } = renderHook(() => useUsers(2));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pagination.page).toBe(2);
    expect(mockUsersApi.getUsers).toHaveBeenCalledWith(2, 6);
  });
});

import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api-client';
import { User, UsersResponse, CreateUserData, UpdateUserData } from '@/types/users';

export const useUsers = (initialPage: number = 1) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    per_page: 6,
    total: 0,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await usersApi.getUsers(page, 6);
      setUsers(response.data);
      setPagination({
        page: response.page,
        per_page: response.per_page,
        total: response.total,
        total_pages: response.total_pages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData): Promise<User> => {
    try {
      const newUser = await usersApi.createUser(userData);
      const userWithId = {
        ...newUser,
        id: Date.now(), 
        avatar: `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=3b82f6&color=fff`,
      };
      setUsers(prev => [userWithId, ...prev.slice(0, 5)]);
      return userWithId;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const updateUser = async (id: number, userData: UpdateUserData): Promise<User> => {
    try {
      const updatedUser = await usersApi.updateUser(id, userData);
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { 
              ...user, 
              ...userData,
              avatar: userData.first_name || userData.last_name 
                ? `https://ui-avatars.com/api/?name=${userData.first_name || user.first_name}+${userData.last_name || user.last_name}&background=3b82f6&color=fff`
                : user.avatar
            }
          : user
      ));
      return updatedUser;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await usersApi.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchUsers(page);
    }
  };

  useEffect(() => {
    fetchUsers(initialPage);
  }, [initialPage]);

  return {
    users,
    pagination,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    goToPage,
  };
};

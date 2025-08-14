"use client";

import { useState } from 'react';
import { useRequireAuth, useLogout, useUsers, useToast } from "@/hooks";
import { User, UserFormData } from '@/types/users';
import UserCard from '@/components/UserCard';
import UserModal from '@/components/UserModal';
import Pagination from '@/components/Pagination';
import Toast from '@/components/Toast';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardPage() {
  const { isLoading: authLoading, isReady, user: currentUser } = useRequireAuth();
  const { logoutAndRedirect } = useLogout();
  const { 
    users, 
    pagination, 
    isLoading: usersLoading, 
    error, 
    createUser, 
    updateUser, 
    deleteUser, 
    goToPage 
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast, showToast, hideToast } = useToast();

  if (authLoading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl mb-4 shadow-lg animate-pulse">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Loading Dashboard...</h1>
          <p className="text-gray-600 dark:text-gray-400">Please wait</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const handleCreateUser = async (userData: UserFormData) => {
    try {
      await createUser({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        job: userData.job,
      });
      showToast('User created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create user. Please try again.', 'error');
      throw error;
    }
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    if (editingUser) {
      try {
        await updateUser(editingUser.id, {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          job: userData.job,
        });
        showToast('User updated successfully!', 'success');
      } catch (error) {
        showToast('Failed to update user. Please try again.', 'error');
        throw error;
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      showToast('User deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete user. Please try again.', 'error');
      throw error;
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg mr-3">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" 
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="flex items-center space-x-3">
                <img 
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.first_name}+${currentUser.last_name}&background=3b82f6&color=fff`}
                  alt={`${currentUser.first_name} ${currentUser.last_name}`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentUser.first_name} {currentUser.last_name}
                </span>
              </div>
              
              <button
                onClick={() => logoutAndRedirect()}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Users Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize all users in your platform
              </p>
              {pagination.total > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Showing {users.length} of {pagination.total} users
                </p>
              )}
            </div>
            <button
              onClick={openCreateModal}
              className="cursor-pointer mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New User
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 dark:text-red-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {usersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No users found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first user.</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First User
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={openEditModal}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={goToPage}
                isLoading={usersLoading}
              />
            </>
          )}
        </div>
      </main>

      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        user={editingUser}
        title={editingUser ? 'Edit User' : 'Create New User'}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

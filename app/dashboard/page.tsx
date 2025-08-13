"use client";

import { useRequireAuth, useLogout } from "@/hooks";

export default function DashboardPage() {
  const { isLoading, isReady, user } = useRequireAuth();
  const { logoutAndRedirect } = useLogout();

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg animate-pulse">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h1>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg mr-3">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3b82f6&color=fff`}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              
              <button
                onClick={() => logoutAndRedirect()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hello {user.first_name}!
            </h2>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </div>

          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3b82f6&color=fff&size=80`}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">User ID: {user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

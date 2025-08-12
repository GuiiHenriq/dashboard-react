"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard UI</h1>
        <p className="text-gray-600 mb-8">Welcome to our beautiful user interface</p>
        
        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="block w-full max-w-xs mx-auto py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View Login Page
          </Link>
          
          <Link 
            href="/auth/register"
            className="block w-full max-w-xs mx-auto py-3 px-6 bg-white text-blue-600 font-semibold rounded-xl border border-blue-600 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
          >
            View Register Page
          </Link>
          
          <Link 
            href="/dashboard"
            className="block w-full max-w-xs mx-auto py-3 px-6 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

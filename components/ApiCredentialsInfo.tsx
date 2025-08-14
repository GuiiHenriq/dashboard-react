"use client";

import { useState } from "react";
import Accordion from "./Accordion";

interface ApiCredentialsInfoProps {
  type: "login" | "register";
  onEmailSelect?: (email: string) => void;
}

export default function ApiCredentialsInfo({ type, onEmailSelect }: ApiCredentialsInfoProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const realApiEmails = [
    { email: "eve.holt@reqres.in", password: "cityslicka", name: "Eve Holt", verified: true },
    { email: "sydney@fife", password: "qualquer_senha", name: "Sydney Fife", verified: true },
    { email: "george.bluth@reqres.in", password: "senha123", name: "George Bluth", verified: false },
    { email: "janet.weaver@reqres.in", password: "password", name: "Janet Weaver", verified: false },
    { email: "emma.wong@reqres.in", password: "test123", name: "Emma Wong", verified: false },
    { email: "charles.morris@reqres.in", password: "charlie", name: "Charles Morris", verified: false },
  ];

  const handleEmailClick = (email: string) => {
    if (onEmailSelect) {
      onEmailSelect(email);
    }
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.07 0 1.92-.843 1.92-1.885 0-.31-.082-.614-.239-.883L13.281 4.52c-.311-.485-.82-.52-1.281-.52s-.97.035-1.281.52L3.381 15.232c-.157.27-.239.573-.239.883 0 1.042.85 1.885 1.92 1.885z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Valid API Emails Only
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {type === "login" 
                ? "Only the credentials listed below will work for login."
                : "Only the emails listed below are accepted for registration on the reqres.io API."
              }
            </p>
          </div>
        </div>
      </div>

      <Accordion 
        title="🌐 Valid reqres.io API Users" 
        defaultOpen={false}
        className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/50"
      >
        <div className="pt-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                {type === "login" ? "Valid Credentials" : "Accepted Emails for Registration"}
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                {type === "login" 
                  ? "Use these credentials to log in:"
                  : "Click on an email to fill it in the form:"
                }
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300">
              💡 <strong>Tip:</strong> Click on any email to automatically fill it in the form.
              {type === "register" && " For registration, you can use any password with the selected email."}
            </p>
          </div>

          <div className="space-y-2">
            {realApiEmails.map((user, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-gray-700 border rounded-lg p-3 hover:border-green-300 dark:hover:border-green-600 transition-colors cursor-pointer relative ${
                  copiedEmail === user.email ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/50' : 'border-green-200 dark:border-green-700'
                }`}
                onClick={() => handleEmailClick(user.email)}
                title="Click to copy the email and fill the form"
              >
                {copiedEmail === user.email && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    ✓ Filled!
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                      {user.verified ? (
                        <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Tested
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      📧 {user.email}
                    </div>
                    {type === "login" && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        🔑 {user.password}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Accordion>
    </div>
  );
}

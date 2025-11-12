import ProtectedRoute from '@/utils/protectedRoute'
import React from 'react'

const Settings = () => {
  return (
    <ProtectedRoute>
      <div>
        {/* Notice: visual "Coming Soon" banner */}
        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
            <svg
              className="w-7 h-7 flex-shrink-0 animate-pulse"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <div>
              <div className="font-semibold text-lg">Settings coming soon</div>
              <p className="text-sm opacity-90">
                We're building the settings page — preferences and controls will be available shortly.
              </p>
            </div>

            <span className="ml-auto inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-white/20">
              Beta
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Account Settings</h3>
              <p className="text-gray-600 text-sm">Manage your account preferences</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Notification Settings</h3>
              <p className="text-gray-600 text-sm">Configure your notification preferences</p>
            </div>
            <div className="pb-4">
              <h3 className="font-semibold mb-2">Privacy Settings</h3>
              <p className="text-gray-600 text-sm">Control your privacy and data settings</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Settings
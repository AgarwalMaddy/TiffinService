import { useState } from 'react';

export type UserRole = 'customer' | 'chef' | 'admin';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  const roles = [
    { id: 'customer', label: 'Customer', description: 'Order delicious tiffins' },
    { id: 'chef', label: 'Chef', description: 'Prepare and sell your tiffins' },
    { id: 'admin', label: 'Administrator', description: 'Manage the platform' },
  ] as const;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Select your role</label>
      <div className="space-y-2">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
              selectedRole === role.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-200'
            }`}
            onClick={() => onRoleChange(role.id)}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <div className="text-sm">
                  <p className={`font-medium ${
                    selectedRole === role.id ? 'text-orange-900' : 'text-gray-900'
                  }`}>
                    {role.label}
                  </p>
                  <p className={`${
                    selectedRole === role.id ? 'text-orange-700' : 'text-gray-500'
                  }`}>
                    {role.description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-orange-500">
                {selectedRole === role.id && (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 

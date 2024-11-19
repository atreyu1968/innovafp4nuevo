import React, { useState } from 'react';
import { Shield, UserCog, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const RoleSelector = () => {
  const { activeRole, setActiveRole } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-20 right-4 z-50">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <div className="flex items-center">
          {activeRole === 'admin' ? (
            <Shield className="h-4 w-4 mr-2" />
          ) : (
            <UserCog className="h-4 w-4 mr-2" />
          )}
          <span>
            {activeRole === 'admin' ? 'Administrador' : 'Coordinador'}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          <button
            onClick={() => {
              setActiveRole('admin');
              setIsOpen(false);
            }}
            className={`w-full flex items-center px-4 py-2 text-sm ${
              activeRole === 'admin'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Administrador
          </button>
          <button
            onClick={() => {
              setActiveRole('coordinator');
              setIsOpen(false);
            }}
            className={`w-full flex items-center px-4 py-2 text-sm ${
              activeRole === 'coordinator'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserCog className="h-4 w-4 mr-2" />
            Coordinador
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
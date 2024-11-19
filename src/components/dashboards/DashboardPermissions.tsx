import React from 'react';
import { X } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

interface DashboardPermissionsProps {
  permissions: {
    roles?: ('gestor' | 'coordinador_subred' | 'coordinador_general')[];
    users?: string[];
  };
  onUpdate: (permissions: any) => void;
  onClose: () => void;
}

const DashboardPermissions: React.FC<DashboardPermissionsProps> = ({
  permissions,
  onUpdate,
  onClose,
}) => {
  const { users } = useUserStore();

  const roles = [
    { id: 'gestor', label: 'Gestor' },
    { id: 'coordinador_subred', label: 'Coordinador de Subred' },
    { id: 'coordinador_general', label: 'Coordinador General' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Permisos del Dashboard</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Roles con acceso</h4>
            <div className="space-y-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.roles?.includes(role.id as any)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...(permissions.roles || []), role.id]
                        : permissions.roles?.filter((r) => r !== role.id);
                      onUpdate({ ...permissions, roles: newRoles });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Usuarios específicos</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.users?.includes(user.id)}
                    onChange={(e) => {
                      const newUsers = e.target.checked
                        ? [...(permissions.users || []), user.id]
                        : permissions.users?.filter((u) => u !== user.id);
                      onUpdate({ ...permissions, users: newUsers });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {user.nombre} {user.apellidos} - {user.email}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPermissions;
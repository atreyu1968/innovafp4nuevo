import React from 'react';
import { Shield, Users, Network } from 'lucide-react';
import { useUserStore } from '../../../stores/userStore';
import { useNetworkStore } from '../../../stores/networkStore';
import { useNotifications } from '../../notifications/NotificationProvider';

interface PermissionsSelectorProps {
  permissions: {
    users: string[];
    subnets: string[];
    roles: string[];
  };
  onPermissionsUpdated: (permissions: {
    users: string[];
    subnets: string[];
    roles: string[];
  }) => void;
  onFinish: () => void;
}

const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({
  permissions,
  onPermissionsUpdated,
  onFinish,
}) => {
  const { users } = useUserStore();
  const { subnets } = useNetworkStore();
  const { showNotification } = useNotifications();

  const handleUserToggle = (userId: string) => {
    const newUsers = permissions.users.includes(userId)
      ? permissions.users.filter(id => id !== userId)
      : [...permissions.users, userId];
    
    onPermissionsUpdated({
      ...permissions,
      users: newUsers,
    });
  };

  const handleSubnetToggle = (subnetId: string) => {
    const newSubnets = permissions.subnets.includes(subnetId)
      ? permissions.subnets.filter(id => id !== subnetId)
      : [...permissions.subnets, subnetId];
    
    onPermissionsUpdated({
      ...permissions,
      subnets: newSubnets,
    });
  };

  const handleRoleToggle = (role: string) => {
    const newRoles = permissions.roles.includes(role)
      ? permissions.roles.filter(r => r !== role)
      : [...permissions.roles, role];
    
    onPermissionsUpdated({
      ...permissions,
      roles: newRoles,
    });
  };

  const handleFinish = () => {
    if (
      permissions.users.length === 0 &&
      permissions.subnets.length === 0 &&
      permissions.roles.length === 0
    ) {
      showNotification('error', 'Debes seleccionar al menos un permiso');
      return;
    }
    onFinish();
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900">Permisos del Informe</h4>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona quién podrá ver este informe
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h5 className="text-sm font-medium text-gray-900 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Usuarios Específicos
          </h5>
          <div className="mt-2 space-y-2">
            {users.map((user) => (
              <label key={user.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.users.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {user.nombre} {user.apellidos} ({user.email})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-900 flex items-center">
            <Network className="h-4 w-4 mr-2" />
            Subredes
          </h5>
          <div className="mt-2 space-y-2">
            {subnets.map((subnet) => (
              <label key={subnet.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.subnets.includes(subnet.id)}
                  onChange={() => handleSubnetToggle(subnet.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {subnet.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-900 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </h5>
          <div className="mt-2 space-y-2">
            {['gestor', 'coordinador_subred', 'coordinador_general'].map((role) => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.roles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {role === 'gestor'
                    ? 'Gestor'
                    : role === 'coordinador_subred'
                    ? 'Coordinador de Subred'
                    : 'Coordinador General'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleFinish}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Generar Informe
        </button>
      </div>
    </div>
  );
};

export default PermissionsSelector;
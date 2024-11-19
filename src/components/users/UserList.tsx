import React, { useState } from 'react';
import { Edit2, Mail, Phone, Filter, Trash2, Key } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { User, UserRole } from '../../types/user';
import UserContactButton from './UserContactButton';
import { useNotifications } from '../notifications/NotificationProvider';

interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
}

const roleLabels = {
  gestor: 'Gestor',
  coordinador_subred: 'Coordinador de Subred',
  coordinador_general: 'Coordinador General',
  admin: 'Administrador'
};

const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => {
  const { deleteUser, removeDuplicates, resetUserPassword } = useUserStore();
  const { showNotification } = useNotifications();
  const [filters, setFilters] = useState({
    role: '',
    subred: '',
    familiaProfesional: '',
  });

  const uniqueSubredes = [...new Set(users.map(user => user.subred).filter(Boolean))];
  const uniqueFamilias = [...new Set(users.map(user => user.familiaProfesional).filter(Boolean))];

  const filteredUsers = users.filter(user => {
    const matchRole = !filters.role || user.roles.includes(filters.role as UserRole);
    const matchSubred = !filters.subred || user.subred === filters.subred;
    const matchFamilia = !filters.familiaProfesional || user.familiaProfesional === filters.familiaProfesional;
    return matchRole && matchSubred && matchFamilia;
  });

  const handleDelete = (user: User) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.nombre} ${user.apellidos}"?`)) {
      deleteUser(user.id);
      showNotification('success', 'Usuario eliminado correctamente');
    }
  };

  const handleResetPassword = async (user: User) => {
    if (!user.telefono) {
      showNotification('error', 'El usuario no tiene teléfono configurado');
      return;
    }

    if (window.confirm(`¿Restablecer la contraseña de ${user.nombre} ${user.apellidos}?`)) {
      try {
        await resetUserPassword(user.id);
        showNotification('success', 'Contraseña restablecida al teléfono del usuario');
      } catch (error) {
        showNotification('error', 'Error al restablecer la contraseña');
      }
    }
  };

  const handleRemoveDuplicates = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar los usuarios duplicados? Esta acción no se puede deshacer.')) {
      const removedCount = removeDuplicates();
      showNotification('success', `Se han eliminado ${removedCount} usuarios duplicados`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={filters.subred}
            onChange={(e) => setFilters(prev => ({ ...prev, subred: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las subredes</option>
            {uniqueSubredes.map(subred => (
              <option key={subred} value={subred}>{subred}</option>
            ))}
          </select>

          <select
            value={filters.familiaProfesional}
            onChange={(e) => setFilters(prev => ({ ...prev, familiaProfesional: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las familias</option>
            {uniqueFamilias.map(familia => (
              <option key={familia} value={familia}>{familia}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRemoveDuplicates}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Eliminar Duplicados
        </button>
      </div>

      {(filters.role || filters.subred || filters.familiaProfesional) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.role && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Rol: {roleLabels[filters.role as UserRole]}
            </span>
          )}
          {filters.subred && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Subred: {filters.subred}
            </span>
          )}
          {filters.familiaProfesional && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Familia: {filters.familiaProfesional}
            </span>
          )}
          <button
            onClick={() => setFilters({ role: '', subred: '', familiaProfesional: '' })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.nombre} {user.apellidos}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        {user.email && (
                          <UserContactButton type="email" value={user.email} />
                        )}
                        {user.telefono && (
                          <UserContactButton type="phone" value={user.telefono} />
                        )}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      {user.roles.map(role => (
                        <p key={role} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {roleLabels[role]}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      {user.familiaProfesional && (
                        <p className="flex items-center text-sm text-gray-500">
                          {user.familiaProfesional}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p className="text-sm text-gray-500">
                        {user.centro || user.subred || 'Coordinación General'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => handleResetPassword(user)}
                    className="text-yellow-400 hover:text-yellow-500"
                    title="Restablecer contraseña"
                  >
                    <Key className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onUserClick(user)}
                    className="text-gray-400 hover:text-gray-500"
                    title="Editar"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-400 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredUsers.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No se encontraron usuarios con los filtros seleccionados
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
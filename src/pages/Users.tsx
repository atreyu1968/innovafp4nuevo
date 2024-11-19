import React, { useState } from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import ImportModal from '../components/users/ImportModal';
import { User } from '../types/user';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Users = () => {
  const { user: currentUser } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const { users, addUser, updateUser } = useUserStore();
  const { showNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Solo el coordinador general puede acceder a esta página
  if (currentUser?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  // Filter active users from current academic year
  const filteredUsers = users.filter(
    user => user.active && user.academicYearId === activeYear?.id
  );

  const handleSubmit = (data: Partial<User>) => {
    try {
      if (selectedUser) {
        updateUser({
          ...selectedUser,
          ...data,
          updatedAt: new Date().toISOString()
        });
        showNotification('success', 'Usuario actualizado correctamente');
      } else {
        addUser({
          ...data,
          id: crypto.randomUUID(),
          academicYearId: activeYear?.id || '',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as User);
        showNotification('success', 'Usuario creado correctamente');
      }
      setShowForm(false);
      setSelectedUser(null);
    } catch (error) {
      showNotification('error', 'Error al guardar el usuario');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="mt-1 text-sm text-gray-500">
            {activeYear ? `Curso académico: ${activeYear.year}` : 'Todos los cursos'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <UserForm
            initialData={selectedUser}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedUser(null);
            }}
          />
        </div>
      ) : (
        <UserList
          users={filteredUsers}
          onUserClick={(user) => {
            setSelectedUser(user);
            setShowForm(true);
          }}
        />
      )}

      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default Users;
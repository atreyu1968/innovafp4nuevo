import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useNotifications } from '../notifications/NotificationProvider';
import { User, UserRole } from '../../types/user';

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
}

const roleLabels = {
  gestor: 'Gestor',
  coordinador_subred: 'Coordinador de Subred',
  coordinador_general: 'Coordinador General',
  admin: 'Administrador'
};

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { activeYear } = useAcademicYearStore();
  const { centers, subnets, families } = useNetworkStore();
  const { showNotification } = useNotifications();

  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    nombre: initialData?.nombre || '',
    apellidos: initialData?.apellidos || '',
    telefono: initialData?.telefono || '',
    familiaProfesional: initialData?.familiaProfesional || '',
    roles: initialData?.roles || [],
    centro: initialData?.centro || '',
    subred: initialData?.subred || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    if (formData.roles.length === 0) {
      showNotification('error', 'Debe seleccionar al menos un rol');
      return;
    }

    try {
      onSubmit({
        ...formData,
        academicYearId: activeYear.id,
        active: true,
      });
      showNotification('success', initialData ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar el usuario');
    }
  };

  // Filtrar centros activos
  const activeCenters = centers.filter(c => c.active);
  const activeSubnets = subnets.filter(s => s.active);
  const activeFamilies = families.filter(f => f.active);

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            type="text"
            required
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Familia Profesional
          </label>
          <select
            value={formData.familiaProfesional}
            onChange={(e) => setFormData({ ...formData, familiaProfesional: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar familia...</option>
            {activeFamilies.map((family) => (
              <option key={family.id} value={family.name}>
                {family.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roles
          </label>
          <div className="space-y-2">
            {Object.entries(roleLabels).map(([role, label]) => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role as UserRole)}
                  onChange={(e) => handleRoleChange(role as UserRole, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Centro
          </label>
          <select
            value={formData.centro}
            onChange={(e) => setFormData({ ...formData, centro: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar centro...</option>
            {activeCenters.map((center) => (
              <option key={center.id} value={center.name}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subred
          </label>
          <select
            value={formData.subred}
            onChange={(e) => setFormData({ ...formData, subred: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar subred...</option>
            {activeSubnets.map((subnet) => (
              <option key={subnet.id} value={subnet.name}>
                {subnet.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { CenterType } from '../../types/network';
import { useNotifications } from '../notifications/NotificationProvider';

interface CenterTypeFormProps {
  initialData?: CenterType;
  onSubmit: () => void;
  onCancel: () => void;
}

const CenterTypeForm: React.FC<CenterTypeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { activeYear } = useAcademicYearStore();
  const { addCenterType, updateCenterType } = useNetworkStore();
  const { showNotification } = useNotifications();

  const [formData, setFormData] = useState<Partial<CenterType>>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    active: initialData?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    try {
      const typeData: CenterType = {
        id: initialData?.id || crypto.randomUUID(),
        ...formData,
        academicYearId: activeYear.id,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CenterType;

      if (initialData) {
        updateCenterType(typeData);
        showNotification('success', 'Tipo de centro actualizado correctamente');
      } else {
        addCenterType(typeData);
        showNotification('success', 'Tipo de centro creado correctamente');
      }

      onSubmit();
    } catch (error) {
      showNotification('error', 'Error al guardar el tipo de centro');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Tipo de centro activo</span>
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

export default CenterTypeForm;
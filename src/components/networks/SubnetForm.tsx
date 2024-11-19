import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useNetworkStore, ISLANDS } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { Subnet } from '../../types/network';
import { useNotifications } from '../notifications/NotificationProvider';

interface SubnetFormProps {
  initialData?: Subnet;
  onSubmit: () => void;
  onCancel: () => void;
}

const SubnetForm: React.FC<SubnetFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { activeYear } = useAcademicYearStore();
  const { addSubnet, updateSubnet, getCIFPs } = useNetworkStore();
  const { showNotification } = useNotifications();
  const cifps = getCIFPs();

  const [formData, setFormData] = useState<Partial<Subnet>>({
    name: initialData?.name || '',
    island: initialData?.island || ISLANDS[0],
    cifpId: initialData?.cifpId || '',
    active: initialData?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    try {
      const subnetData: Subnet = {
        id: initialData?.id || crypto.randomUUID(),
        ...formData,
        academicYearId: activeYear.id,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Subnet;

      if (initialData) {
        updateSubnet(subnetData);
        showNotification('success', 'Subred actualizada correctamente');
      } else {
        addSubnet(subnetData);
        showNotification('success', 'Subred creada correctamente');
      }

      onSubmit();
    } catch (error) {
      showNotification('error', 'Error al guardar la subred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la Subred
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Isla
        </label>
        <select
          value={formData.island}
          onChange={(e) => setFormData({ ...formData, island: e.target.value as any })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {ISLANDS.map((island) => (
            <option key={island} value={island}>
              {island}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          CIFP Coordinador
        </label>
        <select
          value={formData.cifpId}
          onChange={(e) => setFormData({ ...formData, cifpId: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccionar CIFP...</option>
          {cifps.map((cifp) => (
            <option key={cifp.id} value={cifp.id}>
              {cifp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Subred activa</span>
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

export default SubnetForm;
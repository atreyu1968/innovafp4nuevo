import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { ProfessionalFamily } from '../../types/network';

interface FamilyFormProps {
  initialData?: ProfessionalFamily;
  onSubmit: () => void;
  onCancel: () => void;
}

const FamilyForm: React.FC<FamilyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { activeYear } = useAcademicYearStore();
  const { addFamily, updateFamily } = useNetworkStore();

  const [formData, setFormData] = useState<Partial<ProfessionalFamily>>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    active: initialData?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const familyData: ProfessionalFamily = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      academicYearId: activeYear!.id,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ProfessionalFamily;

    if (initialData) {
      updateFamily(familyData);
    } else {
      addFamily(familyData);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
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
        <span className="ml-2 text-sm text-gray-700">Familia profesional activa</span>
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
          Guardar
        </button>
      </div>
    </form>
  );
};

export default FamilyForm;
import React, { useState } from 'react';
import { Edit2, Upload, Download, Trash2 } from 'lucide-react';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { ProfessionalFamily } from '../../types/network';
import ImportModal from './ImportModal';
import { useNotifications } from '../notifications/NotificationProvider';
import FamilyForm from './FamilyForm';

interface FamilyListProps {
  onEdit: (familyId: string) => void;
}

const FamilyList: React.FC<FamilyListProps> = ({ onEdit }) => {
  const { activeYear } = useAcademicYearStore();
  const { families, deleteFamily, getFamiliesByYear, removeDuplicates } = useNetworkStore();
  const { showNotification } = useNotifications();
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFamily, setEditingFamily] = useState<ProfessionalFamily | null>(null);

  const activeFamilies = getFamiliesByYear(activeYear?.id || '');
  const filteredFamilies = activeFamilies.filter(
    (family) =>
      family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (family: ProfessionalFamily) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la familia "${family.name}"?`)) {
      deleteFamily(family.id);
      showNotification('success', 'Familia profesional eliminada correctamente');
    }
  };

  const handleEdit = (family: ProfessionalFamily) => {
    setEditingFamily(family);
  };

  const handleRemoveDuplicates = () => {
    const { families: removedFamilies } = removeDuplicates();
    showNotification('success', `Se han eliminado ${removedFamilies} familias profesionales duplicadas`);
  };

  const downloadTemplate = () => {
    const headers = ['codigo,nombre'];
    const exampleData = ['INF,Informática y Comunicaciones'];
    const csvContent = [...headers, ...exampleData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_familias_profesionales.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (editingFamily) {
    return (
      <FamilyForm
        initialData={editingFamily}
        onSubmit={() => setEditingFamily(null)}
        onCancel={() => setEditingFamily(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRemoveDuplicates}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Eliminar Duplicados
          </button>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar Plantilla
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredFamilies.map((family) => (
            <li key={family.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {family.name}
                      </p>
                      <p className="text-sm text-gray-500">{family.code}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          family.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {family.active ? 'Activa' : 'Inactiva'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(family)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Editar"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(family)}
                    className="p-2 text-red-400 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredFamilies.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No se encontraron familias profesionales
            </li>
          )}
        </ul>
      </div>

      {showImportModal && (
        <ImportModal
          type="family"
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default FamilyList;
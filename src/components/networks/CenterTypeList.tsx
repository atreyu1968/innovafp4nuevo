import React, { useState } from 'react';
import { Edit2, Upload, Download, Trash2 } from 'lucide-react';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { CenterType } from '../../types/network';
import ImportModal from './ImportModal';
import { useNotifications } from '../notifications/NotificationProvider';

interface CenterTypeListProps {
  onEdit: (typeId: string) => void;
}

const CenterTypeList: React.FC<CenterTypeListProps> = ({ onEdit }) => {
  const { activeYear } = useAcademicYearStore();
  const { centerTypes, deleteCenterType, getCenterTypesByYear } = useNetworkStore();
  const { showNotification } = useNotifications();
  const [showImportModal, setShowImportModal] = useState(false);

  const activeCenterTypes = getCenterTypesByYear(activeYear?.id || '');

  const handleDelete = async (type: CenterType) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el tipo de centro "${type.name}"?`)) {
      deleteCenterType(type.id);
      showNotification('success', 'Tipo de centro eliminado correctamente');
    }
  };

  const downloadTemplate = () => {
    const headers = ['codigo,nombre'];
    const exampleData = ['CIFP,Centro Integrado de Formación Profesional'];
    const csvContent = [...headers, ...exampleData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_tipos_centro.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-3">
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {activeCenterTypes.map((type) => (
            <li key={type.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{type.name}</p>
                      <p className="text-sm text-gray-500">{type.code}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        type.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {type.active ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => onEdit(type.id)}
                    className="text-gray-400 hover:text-gray-500"
                    title="Editar"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(type)}
                    className="text-red-400 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {activeCenterTypes.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No hay tipos de centro definidos
            </li>
          )}
        </ul>
      </div>

      {showImportModal && (
        <ImportModal
          type="centerType"
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default CenterTypeList;
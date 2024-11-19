import React, { useState } from 'react';
import { Edit2, MapPin, Upload, Download, Trash2, School } from 'lucide-react';
import { useNetworkStore, ISLANDS } from '../../stores/networkStore';
import { Island, EducationalCenter } from '../../types/network';
import ImportModal from './ImportModal';
import { useNotifications } from '../notifications/NotificationProvider';
import CenterForm from './CenterForm';

interface CenterListProps {
  onEdit: (centerId: string) => void;
}

const CenterList: React.FC<CenterListProps> = ({ onEdit }) => {
  const { centers, deleteCenter, removeDuplicates, getCenterType } = useNetworkStore();
  const { showNotification } = useNotifications();
  const [selectedIsland, setSelectedIsland] = useState<Island | ''>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCenter, setEditingCenter] = useState<EducationalCenter | null>(null);

  const filteredCenters = centers.filter((center) => {
    if (selectedIsland && center.island !== selectedIsland) return false;
    if (selectedType && center.typeId !== selectedType) return false;
    return true;
  });

  const handleDelete = (center: EducationalCenter) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el centro "${center.name}"?`)) {
      deleteCenter(center.id);
      showNotification('success', 'Centro eliminado correctamente');
    }
  };

  const handleEdit = (center: EducationalCenter) => {
    setEditingCenter(center);
  };

  const handleRemoveDuplicates = () => {
    const { centers: removedCenters } = removeDuplicates();
    showNotification('success', `Se han eliminado ${removedCenters} centros duplicados`);
  };

  const downloadTemplate = () => {
    const headers = ['codigo,nombre,tipo_id,isla,subred_id'];
    const exampleData = ['IES001,IES Example,2,Tenerife,SUBNET001'];
    const csvContent = [...headers, ...exampleData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_centros.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (editingCenter) {
    return (
      <CenterForm
        initialData={editingCenter}
        onSubmit={() => setEditingCenter(null)}
        onCancel={() => setEditingCenter(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={selectedIsland}
            onChange={(e) => setSelectedIsland(e.target.value as Island)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas las islas</option>
            {ISLANDS.map((island) => (
              <option key={island} value={island}>
                {island}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            {centers
              .map(center => getCenterType(center.typeId))
              .filter((type, index, self) => 
                type && self.findIndex(t => t?.id === type.id) === index
              )
              .map(type => type && (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))
            }
          </select>
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
          {filteredCenters.map((center) => {
            const centerType = getCenterType(center.typeId);
            return (
              <li key={center.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {center.name}
                        </p>
                        <p className="text-sm text-gray-500">{center.code}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          centerType?.code === 'CIFP'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {centerType?.name || 'Desconocido'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex space-x-6">
                        <p className="flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {center.island}
                        </p>
                        {centerType?.code !== 'CIFP' && (
                          <p className="flex items-center text-sm text-gray-500">
                            <School className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Subred asignada
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(center)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                      title="Editar"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(center)}
                      className="p-2 text-red-400 hover:text-red-500"
                      title="Eliminar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {filteredCenters.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No se encontraron centros
            </li>
          )}
        </ul>
      </div>

      {showImportModal && (
        <ImportModal
          type="center"
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default CenterList;
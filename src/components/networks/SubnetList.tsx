import React, { useState } from 'react';
import { Edit2, MapPin, Upload, Download, Trash2 } from 'lucide-react';
import { useNetworkStore, ISLANDS } from '../../stores/networkStore';
import { Island, Subnet } from '../../types/network';
import ImportModal from './ImportModal';
import { useNotifications } from '../notifications/NotificationProvider';
import SubnetForm from './SubnetForm';

interface SubnetListProps {
  onEdit: (subnetId: string) => void;
}

const SubnetList: React.FC<SubnetListProps> = ({ onEdit }) => {
  const { subnets, deleteSubnet, removeDuplicates } = useNetworkStore();
  const { showNotification } = useNotifications();
  const [selectedIsland, setSelectedIsland] = useState<Island | ''>('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingSubnet, setEditingSubnet] = useState<Subnet | null>(null);

  const filteredSubnets = selectedIsland
    ? subnets.filter((subnet) => subnet.island === selectedIsland)
    : subnets;

  const handleDelete = (subnet: Subnet) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la subred "${subnet.name}"?`)) {
      deleteSubnet(subnet.id);
      showNotification('success', 'Subred eliminada correctamente');
    }
  };

  const handleEdit = (subnet: Subnet) => {
    setEditingSubnet(subnet);
  };

  const handleRemoveDuplicates = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar las subredes duplicadas? Esta acción no se puede deshacer.')) {
      const { subnets: removedSubnets } = removeDuplicates();
      showNotification('success', `Se han eliminado ${removedSubnets} subredes duplicadas`);
    }
  };

  const downloadTemplate = () => {
    const headers = ['nombre,isla,cifp_id'];
    const exampleData = ['Subred Norte,Tenerife,CIFP001'];
    const csvContent = [...headers, ...exampleData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_subredes.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (editingSubnet) {
    return (
      <SubnetForm
        initialData={editingSubnet}
        onSubmit={() => setEditingSubnet(null)}
        onCancel={() => setEditingSubnet(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
          {filteredSubnets.map((subnet) => (
            <li key={subnet.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {subnet.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {subnet.active ? 'Activa' : 'Inactiva'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {subnet.island}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(subnet)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Editar"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(subnet)}
                    className="p-2 text-red-400 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredSubnets.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No se encontraron subredes
            </li>
          )}
        </ul>
      </div>

      {showImportModal && (
        <ImportModal
          type="subnet"
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default SubnetList;
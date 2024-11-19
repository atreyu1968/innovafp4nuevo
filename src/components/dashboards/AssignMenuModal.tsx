import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dashboard } from '../../types/dashboard';
import { useNotifications } from '../notifications/NotificationProvider';

interface AssignMenuModalProps {
  dashboard: Dashboard;
  onClose: () => void;
}

const AVAILABLE_MENUS = [
  { id: 'dashboard', label: 'Dashboard (por defecto)' },
  { id: 'reports', label: 'Informes' },
  { id: 'forms', label: 'Formularios' },
  { id: 'network', label: 'Red' },
];

const AssignMenuModal: React.FC<AssignMenuModalProps> = ({ dashboard, onClose }) => {
  const { showNotification } = useNotifications();
  const [selectedMenu, setSelectedMenu] = useState(dashboard.menuId || 'dashboard');
  const [menuOrder, setMenuOrder] = useState(dashboard.menuOrder || 0);

  const handleSubmit = async () => {
    try {
      // Aquí iría la lógica para actualizar el menú asignado
      showNotification('success', 'Menú asignado correctamente');
      onClose();
    } catch (error) {
      showNotification('error', 'Error al asignar el menú');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Asignar a Menú</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Menú
            </label>
            <select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {AVAILABLE_MENUS.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Orden en el menú
            </label>
            <input
              type="number"
              min="0"
              value={menuOrder}
              onChange={(e) => setMenuOrder(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Los dashboards se mostrarán en orden ascendente
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMenuModal;
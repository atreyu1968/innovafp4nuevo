import React from 'react';
import { Wrench, Calendar } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const MaintenanceSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure maintenance settings exist with default values
  const maintenance = settings.maintenance || {
    enabled: false,
    message: 'El sistema se encuentra en mantenimiento. Por favor, inténtelo más tarde.',
    allowedRoles: ['coordinador_general'],
    plannedEnd: undefined
  };

  const handleMaintenanceChange = (enabled: boolean) => {
    updateSettings({
      maintenance: {
        ...maintenance,
        enabled
      }
    });
    showNotification('success', `Modo mantenimiento ${enabled ? 'activado' : 'desactivado'}`);
  };

  const handleMessageChange = (message: string) => {
    updateSettings({
      maintenance: {
        ...maintenance,
        message
      }
    });
  };

  const handlePlannedEndChange = (date: string) => {
    updateSettings({
      maintenance: {
        ...maintenance,
        plannedEnd: date
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-blue-500" />
          Modo Mantenimiento
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Activa el modo mantenimiento para realizar tareas de actualización o reparación
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Activar Modo Mantenimiento</label>
            <p className="text-sm text-gray-500">
              Solo los administradores podrán acceder al sistema durante el mantenimiento
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={maintenance.enabled}
              onChange={(e) => handleMaintenanceChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {maintenance.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mensaje para los usuarios
              </label>
              <textarea
                value={maintenance.message}
                onChange={(e) => handleMessageChange(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Mensaje que verán los usuarios durante el mantenimiento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Fin planificado
                </div>
              </label>
              <input
                type="datetime-local"
                value={maintenance.plannedEnd || ''}
                onChange={(e) => handlePlannedEndChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Opcional: indica cuándo está previsto finalizar el mantenimiento
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenanceSettings;
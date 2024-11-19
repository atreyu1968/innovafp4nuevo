import React, { useState } from 'react';
import { Download, Plus, Calendar, Save, Trash2 } from 'lucide-react';
import { useBackupStore } from '../../stores/backupStore';
import { useNotifications } from '../notifications/NotificationProvider';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BackupManager = () => {
  const { configs, backups, addConfig, createBackup, deleteConfig, restoreBackup, deleteBackup } = useBackupStore();
  const { showNotification } = useNotifications();
  const [showNewConfig, setShowNewConfig] = useState(false);

  const handleCreateBackup = async (configId?: string) => {
    try {
      if (configId) {
        // Backup programado
        await createBackup(configId);
        showNotification('success', 'Backup programado creado correctamente');
      } else {
        // Backup manual
        const manualBackupData = {
          name: 'Backup Manual',
          frequency: 'daily' as const,
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          retention: 30,
          includeData: {
            forms: true,
            responses: true,
            users: true,
            dashboards: true,
            reports: true,
            network: true,
            settings: true,
          },
        };
        
        const tempConfigId = crypto.randomUUID();
        addConfig(manualBackupData);
        
        await createBackup(tempConfigId);
        deleteConfig(tempConfigId); // Eliminar la configuración temporal
        showNotification('success', 'Backup manual creado correctamente');
      }
    } catch (error) {
      showNotification('error', 'Error al crear el backup');
    }
  };

  const handleRestore = async (backupId: string) => {
    try {
      await restoreBackup(backupId);
      showNotification('success', 'Backup restaurado correctamente');
    } catch (error) {
      showNotification('error', 'Error al restaurar el backup');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Backups</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => handleCreateBackup()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Backup Manual
          </button>
          <button
            onClick={() => setShowNewConfig(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Configuración
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Backups Disponibles</h3>
          <div className="mt-4 space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {format(new Date(backup.timestamp), 'PPpp', { locale: es })}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Tamaño: {(backup.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRestore(backup.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Restaurar
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {backups.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay backups disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Backups Programados</h3>
          <div className="mt-4 space-y-4">
            {configs.map((config) => (
              <div key={config.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{config.name}</h4>
                    <p className="text-sm text-gray-500">
                      {config.frequency === 'daily' ? 'Diario' : 
                       config.frequency === 'weekly' ? 'Semanal' :
                       'Mensual'} a las {config.time}
                    </p>
                    {config.lastBackup && (
                      <p className="text-xs text-gray-400">
                        Último backup: {format(new Date(config.lastBackup), 'PPpp', { locale: es })}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCreateBackup(config.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Ejecutar Ahora
                    </button>
                    <button
                      onClick={() => deleteConfig(config.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {configs.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay backups programados
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
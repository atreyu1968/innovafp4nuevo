import React, { useState } from 'react';
import { Save, Upload, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import ColorPicker from '../components/settings/ColorPicker';
import BackupManager from '../components/backup/BackupManager';
import SecuritySettings from '../components/settings/SecuritySettings';
import MaintenanceSettings from '../components/settings/MaintenanceSettings';
import UpdateSettings from '../components/settings/UpdateSettings';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Settings = () => {
  const { user } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'maintenance' | 'updates' | 'backups'>('general');

  if (user?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateSettings(formData);
      showNotification('success', 'Configuración guardada correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar la configuración');
    }
  };

  const handleColorChange = (color: string, path: string[]) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = color;
      return newData;
    });
  };

  const handleReset = () => {
    setFormData(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Personaliza la apariencia y configuración general de la aplicación
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seguridad
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'maintenance'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mantenimiento
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'updates'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Actualizaciones
            </button>
            <button
              onClick={() => setActiveTab('backups')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'backups'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Backups
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la Aplicación
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={formData.logo}
                      alt="Logo"
                      className="h-12 w-auto object-contain"
                    />
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="URL del logo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Favicon</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={formData.favicon}
                      alt="Favicon"
                      className="h-8 w-8 object-contain"
                    />
                    <input
                      type="text"
                      value={formData.favicon}
                      onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="URL del favicon"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Colores</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <ColorPicker
                    label="Color Principal"
                    color={formData.colors.primary}
                    onChange={(color) => handleColorChange(color, ['colors', 'primary'])}
                  />
                  <ColorPicker
                    label="Color Secundario"
                    color={formData.colors.secondary}
                    onChange={(color) => handleColorChange(color, ['colors', 'secondary'])}
                  />
                  <ColorPicker
                    label="Barra de Navegación (Inicio)"
                    color={formData.colors.navbar.from}
                    onChange={(color) => handleColorChange(color, ['colors', 'navbar', 'from'])}
                  />
                  <ColorPicker
                    label="Barra de Navegación (Fin)"
                    color={formData.colors.navbar.to}
                    onChange={(color) => handleColorChange(color, ['colors', 'navbar', 'to'])}
                  />
                  <ColorPicker
                    label="Barra Lateral"
                    color={formData.colors.sidebar}
                    onChange={(color) => handleColorChange(color, ['colors', 'sidebar'])}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && <SecuritySettings />}

          {activeTab === 'maintenance' && <MaintenanceSettings />}

          {activeTab === 'updates' && <UpdateSettings />}

          {activeTab === 'backups' && <BackupManager />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
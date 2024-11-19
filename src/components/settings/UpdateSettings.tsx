import React, { useState } from 'react';
import { GitBranch, RefreshCw, Github } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const UpdateSettings = () => {
  const { settings, updateSettings, checkForUpdates, performUpdate } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [checking, setChecking] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Ensure updates settings exist with default values
  const updates = settings.updates || {
    githubRepo: '',
    lastUpdate: null,
    autoUpdate: false,
    branch: 'main'
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Nunca';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleRepoChange = (repo: string) => {
    updateSettings({
      updates: {
        ...updates,
        githubRepo: repo
      }
    });
  };

  const handleBranchChange = (branch: string) => {
    updateSettings({
      updates: {
        ...updates,
        branch
      }
    });
  };

  const handleCheckUpdates = async () => {
    if (!updates.githubRepo) {
      showNotification('error', 'Configura primero el repositorio de GitHub');
      return;
    }

    setChecking(true);
    try {
      const { hasUpdates, latestCommit } = await checkForUpdates();
      if (hasUpdates) {
        showNotification('info', 'Hay actualizaciones disponibles');
        updateSettings({
          updates: {
            ...updates,
            lastUpdate: latestCommit
          }
        });
      } else {
        showNotification('info', 'El sistema está actualizado');
      }
    } catch (error) {
      showNotification('error', 'Error al verificar actualizaciones');
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    if (!settings.maintenance?.enabled) {
      showNotification('error', 'Activa el modo mantenimiento antes de actualizar');
      return;
    }

    setUpdating(true);
    try {
      await performUpdate();
      showNotification('success', 'Sistema actualizado correctamente');
    } catch (error) {
      showNotification('error', 'Error al actualizar el sistema');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Github className="h-5 w-5 mr-2 text-blue-500" />
          Actualizaciones
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configura y gestiona las actualizaciones desde GitHub
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Repositorio de GitHub
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              github.com/
            </span>
            <input
              type="text"
              value={updates.githubRepo}
              onChange={(e) => handleRepoChange(e.target.value)}
              placeholder="usuario/repositorio"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Ejemplo: usuario/red-innovacion-fp
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-2" />
              Rama
            </div>
          </label>
          <input
            type="text"
            value={updates.branch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="main"
          />
        </div>

        <div className="text-sm text-gray-500">
          Última actualización: {formatDate(updates.lastUpdate)}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCheckUpdates}
            disabled={checking || !updates.githubRepo}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
            Verificar actualizaciones
          </button>

          <button
            onClick={handleUpdate}
            disabled={updating || !settings.maintenance?.enabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
            Actualizar sistema
          </button>
        </div>

        {!settings.maintenance?.enabled && (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> El modo mantenimiento debe estar activo para realizar actualizaciones. 
              Actívalo en la pestaña "Mantenimiento" antes de actualizar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateSettings;
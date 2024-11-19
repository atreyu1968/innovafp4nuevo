import { useSettingsStore } from '../stores/settingsStore';

export const manualUpdate = async () => {
  const { settings, updateSettings, checkForUpdates, performUpdate } = useSettingsStore.getState();

  // Verificar actualizaciones
  const { hasUpdates, latestCommit } = await checkForUpdates();
  
  if (hasUpdates) {
    // Activar modo mantenimiento
    updateSettings({
      maintenance: {
        ...settings.maintenance,
        enabled: true,
        message: 'Sistema en actualización...',
      }
    });

    // Realizar actualización
    await performUpdate();

    // Actualizar timestamp
    updateSettings({
      updates: {
        ...settings.updates,
        lastUpdate: latestCommit
      }
    });

    // Desactivar modo mantenimiento
    updateSettings({
      maintenance: {
        ...settings.maintenance,
        enabled: false,
      }
    });

    return true;
  }

  return false;
};
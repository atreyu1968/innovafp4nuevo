import React, { useState } from 'react';
import { X, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const UserProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateUserProfile } = useAuthStore();
  const { settings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    photo: user?.photo || '',
    twoFactorEnabled: user?.twoFactorEnabled || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        showNotification('error', 'Las contraseñas no coinciden');
        return;
      }

      if (formData.newPassword === formData.currentPassword) {
        showNotification('error', 'La nueva contraseña debe ser diferente');
        return;
      }
    }

    try {
      await updateUserProfile({
        photo: formData.photo,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        twoFactorEnabled: formData.twoFactorEnabled
      });
      showNotification('success', 'Perfil actualizado correctamente');
      onClose();
    } catch (error) {
      showNotification('error', 'Error al actualizar el perfil');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Previous photo section remains... */}

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña actual
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={!!formData.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {settings.security?.twoFactorAuth.enabled && !settings.security.twoFactorAuth.required && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Autenticación de dos factores
                  </label>
                  <p className="text-sm text-gray-500">
                    Añade una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2 inline-block" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
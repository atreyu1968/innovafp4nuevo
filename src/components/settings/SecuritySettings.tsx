import React from 'react';
import { Shield, Mail, Smartphone } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const SecuritySettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure security settings exist with default values if not initialized
  const security = settings.security || {
    twoFactorAuth: {
      enabled: false,
      required: false,
      methods: ['email', 'authenticator'],
      validityPeriod: 5
    }
  };

  const handleTwoFactorChange = (enabled: boolean) => {
    updateSettings({
      security: {
        ...security,
        twoFactorAuth: {
          ...security.twoFactorAuth,
          enabled
        }
      }
    });
    showNotification('success', `Autenticación de dos factores ${enabled ? 'activada' : 'desactivada'}`);
  };

  const handleRequiredChange = (required: boolean) => {
    updateSettings({
      security: {
        ...security,
        twoFactorAuth: {
          ...security.twoFactorAuth,
          required
        }
      }
    });
    showNotification('success', `2FA ${required ? 'requerido' : 'opcional'} para todos los usuarios`);
  };

  const handleMethodChange = (method: 'email' | 'authenticator', checked: boolean) => {
    const methods = checked 
      ? [...security.twoFactorAuth.methods, method]
      : security.twoFactorAuth.methods.filter(m => m !== method);

    updateSettings({
      security: {
        ...security,
        twoFactorAuth: {
          ...security.twoFactorAuth,
          methods
        }
      }
    });
  };

  const handleValidityPeriodChange = (minutes: number) => {
    updateSettings({
      security: {
        ...security,
        twoFactorAuth: {
          ...security.twoFactorAuth,
          validityPeriod: minutes
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Autenticación de Dos Factores (2FA)
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configura las opciones de seguridad adicional para el acceso a la plataforma
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Activar 2FA</label>
            <p className="text-sm text-gray-500">
              Habilita la autenticación de dos factores para la plataforma
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={security.twoFactorAuth.enabled}
              onChange={(e) => handleTwoFactorChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {security.twoFactorAuth.enabled && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">2FA Obligatorio</label>
                <p className="text-sm text-gray-500">
                  Requiere que todos los usuarios configuren la autenticación de dos factores
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={security.twoFactorAuth.required}
                  onChange={(e) => handleRequiredChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Métodos permitidos</label>
              <p className="text-sm text-gray-500 mb-2">
                Selecciona los métodos de autenticación que los usuarios podrán utilizar
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={security.twoFactorAuth.methods.includes('email')}
                    onChange={(e) => handleMethodChange('email', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Mail className="h-4 w-4 ml-2 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">Código por correo electrónico</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={security.twoFactorAuth.methods.includes('authenticator')}
                    onChange={(e) => handleMethodChange('authenticator', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Smartphone className="h-4 w-4 ml-2 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">Aplicación autenticadora</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Período de validez del código (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={security.twoFactorAuth.validityPeriod}
                onChange={(e) => handleValidityPeriodChange(parseInt(e.target.value))}
                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
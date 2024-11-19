import React from 'react';
import { Wrench, Calendar } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Logo from './Logo';

const MaintenanceMode = () => {
  const { settings } = useSettingsStore();
  const maintenance = settings.maintenance;

  if (!maintenance?.enabled) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <Logo className="justify-center" />
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <Wrench className="h-12 w-12 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema en Mantenimiento
          </h2>
          
          <p className="text-gray-600 mb-6">
            {maintenance.message}
          </p>

          {maintenance.plannedEnd && (
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                Finalización prevista: {format(new Date(maintenance.plannedEnd), 'PPpp', { locale: es })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
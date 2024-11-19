import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useFormStore } from '../../stores/formStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface ImportDashboardModalProps {
  onClose: () => void;
}

const ImportDashboardModal: React.FC<ImportDashboardModalProps> = ({ onClose }) => {
  const { years, activeYear } = useAcademicYearStore();
  const { dashboards, importDashboard } = useDashboardStore();
  const { forms } = useFormStore();
  const { showNotification } = useNotifications();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>([]);

  const previousYearDashboards = dashboards.filter(
    (dashboard) => dashboard.academicYearId !== activeYear?.id
  );

  const handleImport = async () => {
    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    try {
      const imported = await Promise.all(
        selectedDashboards.map((dashboardId) => {
          const dashboard = previousYearDashboards.find((d) => d.id === dashboardId);
          if (!dashboard) return null;

          // Mapear los formularios del año anterior a los nuevos
          const formMapping = new Map();
          dashboard.widgets.forEach((widget) => {
            widget.config.formIds.forEach((oldFormId) => {
              const oldForm = forms.find((f) => f.id === oldFormId);
              if (oldForm) {
                const newForm = forms.find(
                  (f) => f.academicYearId === activeYear.id && f.title === oldForm.title
                );
                if (newForm) {
                  formMapping.set(oldFormId, newForm.id);
                }
              }
            });
          });

          return importDashboard(dashboard, formMapping);
        })
      );

      const successCount = imported.filter(Boolean).length;
      showNotification(
        'success',
        `${successCount} dashboard${successCount !== 1 ? 's' : ''} importado${
          successCount !== 1 ? 's' : ''
        } correctamente`
      );
      onClose();
    } catch (error) {
      showNotification('error', 'Error al importar los dashboards');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Importar Dashboards</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Curso académico de origen
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar curso...</option>
              {years
                .filter((year) => year.id !== activeYear?.id)
                .map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
            </select>
          </div>

          {selectedYear && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboards disponibles
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {previousYearDashboards
                  .filter((d) => d.academicYearId === selectedYear)
                  .map((dashboard) => (
                    <label key={dashboard.id} className="flex items-center p-3 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedDashboards.includes(dashboard.id)}
                        onChange={(e) => {
                          setSelectedDashboards(
                            e.target.checked
                              ? [...selectedDashboards, dashboard.id]
                              : selectedDashboards.filter((id) => id !== dashboard.id)
                          );
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{dashboard.title}</p>
                        {dashboard.description && (
                          <p className="text-sm text-gray-500">{dashboard.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={selectedDashboards.length === 0}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Importar Seleccionados
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportDashboardModal;
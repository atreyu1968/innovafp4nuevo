import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { FormResponse } from '../../../types/form';
import { useNotifications } from '../../notifications/NotificationProvider';

interface DataManipulatorProps {
  data: {
    responses: FormResponse[];
    reportType: 'individual' | 'general';
    additionalSources: Array<{
      name: string;
      data: any[];
      headers: string[];
    }>;
  };
  onDataUpdated: (data: any) => void;
  onNext: () => void;
}

const DataManipulator: React.FC<DataManipulatorProps> = ({
  data,
  onDataUpdated,
  onNext
}) => {
  const [calculatedFields, setCalculatedFields] = useState<Record<string, string>>({});
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldFormula, setNewFieldFormula] = useState('');
  const { showNotification } = useNotifications();

  const handleAddCalculatedField = () => {
    if (!newFieldName.trim() || !newFieldFormula.trim()) {
      showNotification('error', 'El nombre y la fórmula son obligatorios');
      return;
    }

    setCalculatedFields(prev => ({
      ...prev,
      [newFieldName]: newFieldFormula
    }));

    setNewFieldName('');
    setNewFieldFormula('');
    showNotification('success', 'Campo calculado añadido correctamente');
  };

  const handleRemoveCalculatedField = (fieldName: string) => {
    const newFields = { ...calculatedFields };
    delete newFields[fieldName];
    setCalculatedFields(newFields);
  };

  const handleContinue = () => {
    onDataUpdated({
      ...data,
      calculatedFields
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900">Campos Calculados</h4>
        <p className="mt-1 text-sm text-gray-500">
          Añade campos calculados basados en los datos existentes
        </p>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Campo
              </label>
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: Total Participantes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fórmula
              </label>
              <input
                type="text"
                value={newFieldFormula}
                onChange={(e) => setNewFieldFormula(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: SUM(participantes)"
              />
            </div>
          </div>

          <button
            onClick={handleAddCalculatedField}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Campo
          </button>
        </div>

        <div className="mt-6">
          <h5 className="text-sm font-medium text-gray-900 mb-4">
            Campos Calculados Actuales
          </h5>
          <div className="space-y-2">
            {Object.entries(calculatedFields).map(([name, formula]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">{formula}</p>
                </div>
                <button
                  onClick={() => handleRemoveCalculatedField(name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {Object.keys(calculatedFields).length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No hay campos calculados definidos
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar y Continuar
        </button>
      </div>
    </div>
  );
};

export default DataManipulator;
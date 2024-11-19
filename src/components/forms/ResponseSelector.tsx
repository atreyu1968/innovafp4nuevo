import React from 'react';
import { Plus, Edit2, Calendar } from 'lucide-react';
import { FormResponse } from '../../types/form';

interface ResponseSelectorProps {
  responses: FormResponse[];
  onSelect: (response: FormResponse) => void;
  onNewResponse: () => void;
  onClose: () => void;
  canSubmitNew: boolean;
}

const ResponseSelector: React.FC<ResponseSelectorProps> = ({
  responses,
  onSelect,
  onNewResponse,
  onClose,
  canSubmitNew,
}) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Respuestas Existentes
        </h3>
        
        <div className="space-y-4">
          {canSubmitNew && (
            <button
              onClick={onNewResponse}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <Plus className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Nueva Respuesta</p>
                  <p className="text-sm text-blue-700">Crear una nueva respuesta</p>
                </div>
              </div>
            </button>
          )}

          {responses.map((response) => (
            <button
              key={response.id}
              onClick={() => onSelect(response)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Edit2 className="h-5 w-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Respuesta del {new Date(response.responseTimestamp).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estado: {response.status === 'borrador' ? 'Borrador' : 'Enviada'}
                  </p>
                </div>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseSelector;
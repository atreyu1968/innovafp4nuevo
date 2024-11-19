import React, { useState } from 'react';
import { Link as LinkIcon, AlertCircle } from 'lucide-react';
import { FormField } from '../../types/form';

interface GoogleFormsImportProps {
  onImport: (fields: FormField[]) => void;
  onClose: () => void;
}

const GoogleFormsImport: React.FC<GoogleFormsImportProps> = ({ onImport, onClose }) => {
  const [formUrl, setFormUrl] = useState('');
  const [error, setError] = useState('');

  const handleUrlImport = async () => {
    try {
      if (!formUrl.includes('forms.google.com')) {
        throw new Error('La URL debe ser de Google Forms');
      }

      setError('Lo sentimos, actualmente la importación directa desde Google Forms no está disponible debido a limitaciones técnicas de la API de Google. Por favor, crea el formulario manualmente.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Importar desde Google Forms
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Formulario
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://docs.google.com/forms/d/..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleUrlImport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Importar
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Pega la URL del formulario de Google Forms que deseas importar
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Nota Importante:
          </h4>
          <p className="text-sm text-blue-700">
            Debido a las limitaciones técnicas de la API de Google Forms, actualmente no es posible importar formularios directamente. Te recomendamos crear el formulario manualmente usando nuestro constructor de formularios, que ofrece funcionalidades similares.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleFormsImport;
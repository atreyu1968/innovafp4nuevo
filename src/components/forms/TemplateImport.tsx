import React, { useState } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import { FormField } from '../../types/form';

interface TemplateImportProps {
  onImport: (fields: FormField[]) => void;
  onClose: () => void;
}

const TemplateImport: React.FC<TemplateImportProps> = ({ onImport, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && 
          !selectedFile.type.includes('document') &&
          !selectedFile.type.includes('text/plain')) {
        setError('Por favor, sube un archivo PDF o documento de texto');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      // Aquí procesaríamos el archivo para extraer campos
      // Por ahora, crearemos campos básicos basados en el tipo de archivo
      const fields: FormField[] = [
        {
          id: crypto.randomUUID(),
          type: 'text',
          label: 'Título del Documento',
          required: true,
        },
        {
          id: crypto.randomUUID(),
          type: 'textarea',
          label: 'Contenido Principal',
          required: true,
        },
        {
          id: crypto.randomUUID(),
          type: 'file',
          label: 'Archivos Adjuntos',
          required: false,
          fileTypes: ['application/pdf', 'image/*'],
          multiple: true,
        },
      ];

      onImport(fields);
      onClose();
    } catch (err) {
      setError('Error al procesar el archivo. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Importar Plantilla de Documento
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Documento
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Subir un archivo</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">o arrastra y suelta</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX o TXT
              </p>
            </div>
          </div>
        </div>

        {file && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{file.name}</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Nota Importante:
          </h4>
          <p className="text-sm text-blue-700">
            Al importar un documento, se creará un formulario con campos básicos para recopilar información similar. Podrás personalizar los campos después de la importación.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!file}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4 mr-2 inline-block" />
            Importar Documento
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateImport;
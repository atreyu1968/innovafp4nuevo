import React, { useState } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import mammoth from 'mammoth';
import { Report, ReportSection } from '../../types/reports';

interface WordTemplateImportProps {
  onImport: (report: Partial<Report>) => void;
  onClose: () => void;
}

const WordTemplateImport: React.FC<WordTemplateImportProps> = ({ onImport, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.docx')) {
        setError('Por favor, sube un documento de Word (.docx)');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const processWordDocument = async (file: File): Promise<Partial<Report>> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    // Dividir el texto en secciones basadas en títulos
    const sections = text.split(/\n(?=[A-Z][^a-z\n]*:)/).map((section, index): ReportSection => {
      const [title, ...content] = section.trim().split('\n');
      return {
        id: crypto.randomUUID(),
        title: title.replace(/:$/, ''),
        content: content.join('\n').trim(),
        order: index,
      };
    });

    return {
      title: file.name.replace('.docx', ''),
      sections,
    };
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const reportData = await processWordDocument(file);
      onImport(reportData);
      onClose();
    } catch (err) {
      setError('Error al procesar el documento. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Importar Plantilla de Word
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
            Seleccionar Documento de Word
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
                    accept=".docx"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">o arrastra y suelta</p>
              </div>
              <p className="text-xs text-gray-500">
                Solo documentos de Word (.docx)
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
            Formato Recomendado:
          </h4>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Usa títulos claros seguidos de dos puntos</li>
            <li>Separa las secciones con líneas en blanco</li>
            <li>Incluye el contenido debajo de cada título</li>
            <li>Mantén un formato consistente en todo el documento</li>
          </ul>
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
            disabled={!file || loading}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2 inline-block" />
                Importar Documento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordTemplateImport;
import React, { useState, useRef } from 'react';
import { Upload, Plus, FileText } from 'lucide-react';
import { Form, FormResponse } from '../../../types/form';
import { useNotifications } from '../../notifications/NotificationProvider';
import { useFormStore } from '../../../stores/formStore';
import * as XLSX from 'xlsx';

interface DataSourceSelectorProps {
  form: Form;
  initialResponses: FormResponse[];
  availableForms: Form[];
  onDataSelected: (data: {
    responses: FormResponse[];
    reportType: 'individual' | 'general';
    additionalSources: Array<{
      name: string;
      data: any[];
      headers: string[];
    }>;
  }) => void;
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  form,
  initialResponses,
  availableForms,
  onDataSelected,
}) => {
  const { showNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedForms, setSelectedForms] = useState<string[]>([form.id]);
  const [reportType, setReportType] = useState<'individual' | 'general'>('general');
  const [additionalSources, setAdditionalSources] = useState<Array<{
    name: string;
    data: any[];
    headers: string[];
  }>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const headers = Object.keys(jsonData[0] || {});

        setAdditionalSources(prev => [...prev, {
          name: file.name.replace(/\.[^/.]+$/, ""),
          data: jsonData,
          headers
        }]);

        showNotification('success', 'Datos importados correctamente');
      } catch (error) {
        showNotification('error', 'Error al procesar el archivo');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleContinue = () => {
    const selectedResponses = initialResponses.filter(
      response => selectedForms.includes(response.formId)
    );

    if (selectedResponses.length === 0) {
      showNotification('error', 'Debes seleccionar al menos una respuesta');
      return;
    }

    onDataSelected({
      responses: selectedResponses,
      reportType,
      additionalSources,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900">Tipo de Informe</h4>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <button
            onClick={() => setReportType('individual')}
            className={`p-4 border rounded-lg text-left ${
              reportType === 'individual'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <h5 className="font-medium text-gray-900">Informe Individual</h5>
            <p className="mt-1 text-sm text-gray-500">
              Genera un informe separado para cada respuesta
            </p>
          </button>

          <button
            onClick={() => setReportType('general')}
            className={`p-4 border rounded-lg text-left ${
              reportType === 'general'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <h5 className="font-medium text-gray-900">Informe General</h5>
            <p className="mt-1 text-sm text-gray-500">
              Genera un único informe con todas las respuestas
            </p>
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900">Formularios</h4>
        <div className="mt-4 space-y-2">
          {availableForms.map((availableForm) => (
            <label key={availableForm.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedForms.includes(availableForm.id)}
                onChange={(e) => {
                  const newForms = e.target.checked
                    ? [...selectedForms, availableForm.id]
                    : selectedForms.filter(id => id !== availableForm.id);
                  setSelectedForms(newForms);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {availableForm.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">Datos Adicionales</h4>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Excel
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="space-y-4">
          {additionalSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{source.name}</p>
                  <p className="text-xs text-gray-500">
                    {source.headers.length} columnas, {source.data.length} filas
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAdditionalSources(prev => prev.filter((_, i) => i !== index));
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default DataSourceSelector;
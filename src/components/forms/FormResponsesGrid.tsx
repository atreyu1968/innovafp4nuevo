import React, { useState, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { Save, X, Download, Upload } from 'lucide-react';
import { Form } from '../../types/form';
import { useFormStore } from '../../stores/formStore';
import { useNotifications } from '../notifications/NotificationProvider';
import ReportGenerator from './report/ReportGenerator';
import * as XLSX from 'xlsx';

registerAllModules();

interface FormResponsesGridProps {
  form: Form;
  onClose: () => void;
}

const FormResponsesGrid: React.FC<FormResponsesGridProps> = ({ form, onClose }) => {
  const hotRef = useRef<any>(null);
  const { getResponsesByForm, updateResponse } = useFormStore();
  const { showNotification } = useNotifications();
  const [hasChanges, setHasChanges] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  const responses = getResponsesByForm(form.id);
  
  // Add user information to headers
  const headers = ['Usuario', 'Rol', 'Fecha de envío', ...form.fields.map(field => field.label)];
  const data = responses.map(response => [
    response.userName,
    response.userRole,
    new Date(response.submissionTimestamp || response.lastModifiedTimestamp).toLocaleString(),
    ...form.fields.map(field => response.responses[field.id])
  ]);

  const handleSave = () => {
    const modifiedData = hotRef.current.hotInstance.getData();
    responses.forEach((response, index) => {
      const updatedResponses = {};
      form.fields.forEach((field, fieldIndex) => {
        updatedResponses[field.id] = modifiedData[index][fieldIndex + 3]; // +3 for user info columns
      });
      
      updateResponse({
        ...response,
        responses: updatedResponses,
        updatedAt: new Date().toISOString()
      });
    });
    
    setHasChanges(false);
    showNotification('success', 'Cambios guardados correctamente');
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');
    XLSX.writeFile(wb, `${form.title}_respuestas.xlsx`);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const importedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          
          // Skip header row and update data
          const dataToImport = importedData.slice(1);
          hotRef.current.hotInstance.loadData(dataToImport);
          setHasChanges(true);
          
          showNotification('success', 'Datos importados correctamente');
        } catch (error) {
          showNotification('error', 'Error al importar el archivo');
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Respuestas: {form.title}
          </h3>
          <div className="flex space-x-2">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportExcel}
              className="hidden"
              id="excel-import"
            />
            <label
              htmlFor="excel-import"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Excel
            </label>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </button>
            <button
              onClick={() => setShowReportGenerator(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Generar Informe
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
          <HotTable
            ref={hotRef}
            data={data}
            colHeaders={headers}
            rowHeaders={true}
            height="100%"
            licenseKey="non-commercial-and-evaluation"
            afterChange={() => setHasChanges(true)}
            contextMenu={true}
            multiColumnSorting={true}
            filters={true}
            dropdownMenu={true}
            columnSorting={true}
            manualColumnResize={true}
            manualRowResize={true}
            formulas={true}
            comments={true}
            readOnly={[0, 1, 2]} // Make user info columns read-only
          />
        </div>
      </div>

      {showReportGenerator && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
            <ReportGenerator
              initialResponses={responses}
              onClose={() => setShowReportGenerator(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponsesGrid;
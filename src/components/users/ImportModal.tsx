import React, { useState, useRef } from 'react';
import { X, Upload, Download } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { ImportResult } from '../../types/user';
import { useNotifications } from '../notifications/NotificationProvider';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { importUsers, importFromPreviousYear } = useUserStore();
  const { years, activeYear } = useAcademicYearStore();
  const { showNotification } = useNotifications();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportFile = async () => {
    if (!selectedFile) return;

    try {
      const result = await importUsers(selectedFile);
      if (result.success) {
        showNotification('success', result.message);
        onClose();
      } else {
        showNotification('error', `${result.message}. ${result.errors?.join('. ')}`);
      }
    } catch (error) {
      showNotification('error', 'Error al importar el archivo');
    }
  };

  const handleImportFromYear = (fromYearId: string) => {
    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    try {
      const result = importFromPreviousYear(fromYearId, activeYear.id);
      if (result.success) {
        showNotification('success', result.message);
        onClose();
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', 'Error al importar desde el curso anterior');
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'email',
      'nombre',
      'apellidos',
      'telefono',
      'familiaProfesional',
      'role',
      'centro',
      'subred',
      'academicYearId',
      'active'
    ];

    const exampleData = [
      'usuario@ejemplo.com',
      'Nombre',
      'Apellidos',
      '666111222',
      'Informática y Comunicaciones',
      'gestor',
      'IES Example',
      'Madrid-Norte',
      activeYear?.id || '2023-24',
      'true'
    ];

    const csvContent = [
      headers.join(','),
      exampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_usuarios.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Importar Usuarios</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Importar desde CSV
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar archivo
              </button>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Plantilla
              </button>
              {selectedFile && (
                <span className="text-sm text-gray-500">{selectedFile.name}</span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Descarga la plantilla CSV para ver el formato correcto de importación
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Importar desde curso anterior
            </h4>
            <div className="space-y-2">
              {years
                .filter((year) => year.id !== activeYear?.id)
                .map((year) => (
                  <button
                    key={year.id}
                    onClick={() => handleImportFromYear(year.id)}
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    {year.year}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            {selectedFile && (
              <button
                onClick={handleImportFile}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Importar CSV
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
import React, { useState, useRef } from 'react';
import { X, Upload, Download } from 'lucide-react';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface ImportModalProps {
  type: 'family' | 'subnet' | 'center';
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ type, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showNotification } = useNotifications();
  const { years, activeYear } = useAcademicYearStore();
  const {
    importFamiliesFromCSV,
    importFamiliesFromYear,
    importSubnetsFromCSV,
    importSubnetsFromYear,
    importCentersFromCSV,
    importCentersFromYear,
  } = useNetworkStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportFromCSV = async () => {
    if (!selectedFile) return;
    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    try {
      let result;
      switch (type) {
        case 'family':
          result = await importFamiliesFromCSV(selectedFile);
          break;
        case 'subnet':
          result = await importSubnetsFromCSV(selectedFile);
          break;
        case 'center':
          result = await importCentersFromCSV(selectedFile);
          break;
      }

      if (result.success) {
        showNotification('success', result.message);
        onClose();
      } else {
        showNotification('error', result.message);
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
      switch (type) {
        case 'family':
          importFamiliesFromYear(fromYearId, activeYear.id);
          break;
        case 'subnet':
          importSubnetsFromYear(fromYearId, activeYear.id);
          break;
        case 'center':
          importCentersFromYear(fromYearId, activeYear.id);
          break;
      }

      showNotification('success', 'Importación completada correctamente');
      onClose();
    } catch (error) {
      showNotification('error', 'Error al importar desde el curso anterior');
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'family':
        return 'Familias Profesionales';
      case 'subnet':
        return 'Subredes';
      case 'center':
        return 'Centros';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Importar {getTitle()}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Importar desde CSV
            </h4>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
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
            </div>
            {selectedFile && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">{selectedFile.name}</span>
                <button
                  onClick={handleImportFromCSV}
                  className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Importar CSV
                </button>
              </div>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
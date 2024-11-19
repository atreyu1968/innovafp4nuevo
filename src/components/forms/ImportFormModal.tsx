import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { Form } from '../../types/form';

interface ImportFormModalProps {
  onClose: () => void;
}

const ImportFormModal: React.FC<ImportFormModalProps> = ({ onClose }) => {
  const { forms, addForm } = useFormStore();
  const { years, activeYear } = useAcademicYearStore();
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const previousYearForms = forms.filter(
    (form) => form.academicYearId !== activeYear?.id
  );

  const handleImport = () => {
    if (!activeYear) {
      setImportStatus({
        success: false,
        message: 'No hay un curso académico activo',
      });
      return;
    }

    try {
      const formsToImport = previousYearForms.filter((form) =>
        selectedForms.includes(form.id)
      );

      formsToImport.forEach((form) => {
        const newForm: Form = {
          ...form,
          id: crypto.randomUUID(),
          academicYearId: activeYear.id,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addForm(newForm);
      });

      setImportStatus({
        success: true,
        message: `${formsToImport.length} formularios importados correctamente`,
      });

      setTimeout(onClose, 2000);
    } catch (error) {
      setImportStatus({
        success: false,
        message: 'Error al importar los formularios',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Importar Formularios de Cursos Anteriores
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {importStatus.message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              importStatus.success
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {importStatus.message}
          </div>
        )}

        <div className="space-y-4">
          {previousYearForms.length > 0 ? (
            <>
              <div className="max-h-96 overflow-y-auto">
                {previousYearForms.map((form) => {
                  const year = years.find((y) => y.id === form.academicYearId);
                  return (
                    <label
                      key={form.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md"
                    >
                      <input
                        type="checkbox"
                        checked={selectedForms.includes(form.id)}
                        onChange={(e) => {
                          setSelectedForms(
                            e.target.checked
                              ? [...selectedForms, form.id]
                              : selectedForms.filter((id) => id !== form.id)
                          );
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{form.title}</p>
                        <p className="text-sm text-gray-500">
                          Curso: {year?.year || 'Desconocido'}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleImport}
                  disabled={selectedForms.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importar Seleccionados
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No hay formularios disponibles de cursos anteriores
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportFormModal;
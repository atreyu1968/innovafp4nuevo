import React, { useState, useEffect } from 'react';
import { Save, Send, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Form, FormResponse as IFormResponse } from '../../types/form';
import { useFormStore } from '../../stores/formStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotifications } from '../notifications/NotificationProvider';
import ResponseSelector from './ResponseSelector';
import FileUpload from './FileUpload';
import TextareaAutosize from 'react-textarea-autosize';

interface FormResponseProps {
  form: Form;
  onClose: () => void;
}

const FormResponse: React.FC<FormResponseProps> = ({ form, onClose }) => {
  const { user } = useAuthStore();
  const { addResponse, updateResponse, getResponsesByUser } = useFormStore();
  const { showNotification } = useNotifications();
  const [showSelector, setShowSelector] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [selectedResponse, setSelectedResponse] = useState<IFormResponse | null>(null);

  // Get user's responses for this form
  const userResponses = user ? getResponsesByUser(user.id, form.id) : [];
  const canSubmitNew = form.allowMultipleResponses || userResponses.length === 0;

  useEffect(() => {
    // Show selector if user has previous responses and form allows modifications
    if (userResponses.length > 0 && (form.allowResponseModification || form.allowMultipleResponses)) {
      setShowSelector(true);
    }
  }, []);

  // Group fields by sections
  const sections = form.fields.reduce((acc: any[], field) => {
    if (field.type === 'section') {
      acc.push({
        title: field.label,
        fields: field.fields || []
      });
    } else {
      if (acc.length === 0) {
        acc.push({
          title: 'General',
          fields: []
        });
      }
      acc[acc.length - 1].fields.push(field);
    }
    return acc;
  }, []);

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    
    if (!user) return;

    const now = new Date().toISOString();
    const responseData: IFormResponse = {
      id: selectedResponse?.id || crypto.randomUUID(),
      formId: form.id,
      userId: user.id,
      userName: user.nombre,
      userRole: user.role,
      academicYearId: form.academicYearId,
      responses: formData,
      status: isDraft ? 'borrador' : 'enviado',
      responseTimestamp: selectedResponse?.responseTimestamp || now,
      lastModifiedTimestamp: now,
      submissionTimestamp: isDraft ? undefined : now,
      version: (selectedResponse?.version || 0) + 1,
      isModification: !!selectedResponse,
      originalResponseId: selectedResponse?.originalResponseId || selectedResponse?.id
    };

    try {
      if (selectedResponse) {
        updateResponse(responseData);
      } else {
        addResponse(responseData);
      }

      showNotification('success', isDraft ? 'Borrador guardado' : 'Respuesta enviada correctamente');
      onClose();
    } catch (error) {
      showNotification('error', 'Error al guardar la respuesta');
    }
  };

  const handleSelectResponse = (response: IFormResponse) => {
    setSelectedResponse(response);
    setFormData(response.responses);
    setShowSelector(false);
  };

  const handleNewResponse = () => {
    setSelectedResponse(null);
    setFormData({});
    setShowSelector(false);
  };

  const renderField = (field: any) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );

      case 'textarea':
        return (
          <TextareaAutosize
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            minRows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="mt-2 space-y-2">
            {field.options?.map((option: string) => (
              <label key={option} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  required={field.required}
                  className="form-radio"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {field.options?.map((option: string) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = new Set(value || []);
                    if (e.target.checked) {
                      currentValues.add(option);
                    } else {
                      currentValues.delete(option);
                    }
                    setFormData({ ...formData, [field.id]: Array.from(currentValues) });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );

      case 'file':
        return (
          <FileUpload
            value={value}
            onChange={(files) => setFormData({ ...formData, [field.id]: files })}
            fileTypes={field.fileTypes}
            maxFileSize={field.maxFileSize}
            multiple={field.multiple}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  if (showSelector) {
    return (
      <ResponseSelector
        responses={userResponses}
        onSelect={handleSelectResponse}
        onNewResponse={handleNewResponse}
        onClose={onClose}
        canSubmitNew={canSubmitNew}
      />
    );
  }

  const currentSectionData = sections[currentSection];

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {form.title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <h4 className="text-md font-medium text-gray-800">
              {currentSectionData.title}
            </h4>

            {currentSectionData.fields.map((field: any) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-sm text-gray-500">{field.description}</p>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={currentSection === sections.length - 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar borrador
            </button>
            {currentSection === sections.length - 1 && (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-2">
          {sections.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSection ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {selectedResponse && (
        <div className="text-sm text-gray-500">
          <p>Última modificación: {new Date(selectedResponse.lastModifiedTimestamp).toLocaleString()}</p>
          {selectedResponse.submissionTimestamp && (
            <p>Enviado: {new Date(selectedResponse.submissionTimestamp).toLocaleString()}</p>
          )}
        </div>
      )}
    </form>
  );
};

export default FormResponse;
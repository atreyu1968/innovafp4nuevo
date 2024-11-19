import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useFormStore } from '../stores/formStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { Form } from '../types/form';
import FormBuilder from '../components/forms/FormBuilder';
import FormList from '../components/forms/FormList';
import FormResponse from '../components/forms/FormResponse';
import FormResponsesGrid from '../components/forms/FormResponsesGrid';
import ImportFormModal from '../components/forms/ImportFormModal';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Forms = () => {
  const { user, activeRole } = useAuthStore();
  const { forms, addForm, updateForm, deleteForm } = useFormStore();
  const { showNotification } = useNotifications();
  const { activeYear } = useAcademicYearStore();
  const [showBuilder, setShowBuilder] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showResponsesGrid, setShowResponsesGrid] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const isAdmin = user?.role === 'coordinador_general' && activeRole === 'admin';
  const userForms = isAdmin
    ? forms
    : forms.filter(
        (form) =>
          form.status === 'publicado' &&
          form.assignedRoles.includes(user?.role || '')
      );

  const handleFormSubmit = (formData: Partial<Form>) => {
    const now = new Date().toISOString();
    if (selectedForm) {
      updateForm({
        ...selectedForm,
        ...formData,
        updatedAt: now,
      } as Form);
      
      if (formData.status === 'publicado') {
        showNotification('success', 'El formulario ha sido publicado correctamente');
      } else {
        showNotification('success', 'El formulario ha sido guardado como borrador');
      }
    } else {
      addForm({
        ...formData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        acceptingResponses: formData.status === 'publicado',
      } as Form);

      if (formData.status === 'publicado') {
        showNotification('success', 'El nuevo formulario ha sido publicado');
      } else {
        showNotification('success', 'El nuevo formulario ha sido guardado como borrador');
      }
    }
    setShowBuilder(false);
    setSelectedForm(null);
  };

  const handleDeleteForm = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (!form) return;

    const firstConfirm = window.confirm(
      `¿Estás seguro de que deseas eliminar el formulario "${form.title}"?\n\nEsta acción eliminará también todas las respuestas asociadas.`
    );

    if (firstConfirm) {
      const secondConfirm = window.confirm(
        `ADVERTENCIA: Esta acción es irreversible.\n\n¿Realmente deseas eliminar permanentemente el formulario "${form.title}" y todos sus datos?`
      );

      if (secondConfirm) {
        deleteForm(formId);
        showNotification('success', 'Formulario y sus respuestas eliminados correctamente');
      }
    }
  };

  const handleDuplicateForm = (form: Form) => {
    const now = new Date().toISOString();
    const duplicatedForm: Form = {
      ...form,
      id: crypto.randomUUID(),
      title: `${form.title} (copia)`,
      status: 'borrador',
      createdAt: now,
      updatedAt: now,
      acceptingResponses: false,
    };
    addForm(duplicatedForm);
    showNotification('success', 'Formulario duplicado correctamente');
  };

  const handleToggleStatus = (form: Form) => {
    const newStatus = form.status === 'publicado' ? 'cerrado' : 'publicado';
    updateForm({
      ...form,
      status: newStatus,
      acceptingResponses: newStatus === 'publicado',
      updatedAt: new Date().toISOString(),
    });
    showNotification('success', `Formulario ${newStatus === 'publicado' ? 'publicado' : 'cerrado'} correctamente`);
  };

  const handleToggleResponses = (form: Form) => {
    updateForm({
      ...form,
      acceptingResponses: !form.acceptingResponses,
      updatedAt: new Date().toISOString(),
    });
    showNotification('success', `Formulario ${form.acceptingResponses ? 'ya no acepta' : 'ahora acepta'} respuestas`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Formularios</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? 'Gestión de formularios personalizados'
              : 'Formularios asignados'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Importar de Curso Anterior
            </button>
            <button
              onClick={() => {
                setSelectedForm(null);
                setShowBuilder(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Formulario
            </button>
          </div>
        )}
      </div>

      {showBuilder ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedForm ? 'Editar Formulario' : 'Nuevo Formulario'}
          </h3>
          <FormBuilder
            initialData={selectedForm || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowBuilder(false);
              setSelectedForm(null);
            }}
          />
        </div>
      ) : showResponse ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <FormResponse
            form={selectedForm!}
            onClose={() => {
              setShowResponse(false);
              setSelectedForm(null);
            }}
          />
        </div>
      ) : showResponsesGrid ? (
        <FormResponsesGrid
          form={selectedForm!}
          onClose={() => {
            setShowResponsesGrid(false);
            setSelectedForm(null);
          }}
        />
      ) : (
        <FormList
          forms={userForms}
          isAdmin={isAdmin}
          onFormClick={(form) => {
            setSelectedForm(form);
            if (isAdmin) {
              setShowBuilder(true);
            } else {
              setShowResponse(true);
            }
          }}
          onViewResponses={(form) => {
            setSelectedForm(form);
            setShowResponsesGrid(true);
          }}
          onDuplicate={handleDuplicateForm}
          onDelete={handleDeleteForm}
          onToggleStatus={handleToggleStatus}
          onToggleResponses={handleToggleResponses}
        />
      )}

      {showImportModal && (
        <ImportFormModal
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default Forms;
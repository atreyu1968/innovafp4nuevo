import React, { useState } from 'react';
import { Save, X, Send, Plus, Upload } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Form, FormField as IFormField } from '../../types/form';
import FormField from './FormField';
import TextareaAutosize from 'react-textarea-autosize';
import WordImport from './WordImport';
import { useNotifications } from '../notifications/NotificationProvider';

interface FormBuilderProps {
  initialData?: Form;
  onSubmit: (data: Partial<Form>) => void;
  onCancel: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Form>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    fields: initialData?.fields || [],
    assignedRoles: initialData?.assignedRoles || [],
    startDate: initialData?.startDate,
    endDate: initialData?.endDate,
    status: initialData?.status || 'borrador',
    allowMultipleResponses: initialData?.allowMultipleResponses ?? false,
    allowResponseModification: initialData?.allowResponseModification ?? false,
  });

  const [showWordImport, setShowWordImport] = useState(false);
  const { showNotification } = useNotifications();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formData.fields?.findIndex((field) => field.id === active.id);
      const newIndex = formData.fields?.findIndex((field) => field.id === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && formData.fields) {
        setFormData({
          ...formData,
          fields: arrayMove(formData.fields, oldIndex, newIndex),
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();

    if (!formData.title) {
      showNotification('error', 'El título es obligatorio');
      return;
    }

    if (!formData.fields?.length) {
      showNotification('error', 'Debes añadir al menos un campo');
      return;
    }

    if (!formData.assignedRoles?.length) {
      showNotification('error', 'Debes asignar al menos un rol');
      return;
    }

    onSubmit({
      ...formData,
      status: isDraft ? 'borrador' : 'publicado',
    });
  };

  const handleAddField = (afterId?: string) => {
    const newField: IFormField = {
      id: crypto.randomUUID(),
      type: 'text',
      label: '',
      required: false,
    };

    if (afterId && formData.fields) {
      const index = formData.fields.findIndex((field) => field.id === afterId);
      const newFields = [...formData.fields];
      newFields.splice(index + 1, 0, newField);
      setFormData({ ...formData, fields: newFields });
    } else {
      setFormData({
        ...formData,
        fields: [...(formData.fields || []), newField],
      });
    }
  };

  const handleUpdateField = (fieldId: string, updates: Partial<IFormField>) => {
    setFormData({
      ...formData,
      fields: formData.fields?.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  const handleDeleteField = (fieldId: string) => {
    setFormData({
      ...formData,
      fields: formData.fields?.filter((field) => field.id !== fieldId),
    });
  };

  const handleDuplicateField = (fieldId: string) => {
    const field = formData.fields?.find((f) => f.id === fieldId);
    if (field) {
      const newField = {
        ...field,
        id: crypto.randomUUID(),
        label: `${field.label} (copia)`,
      };
      const index = formData.fields?.findIndex((f) => f.id === fieldId);
      if (index !== undefined && formData.fields) {
        const newFields = [...formData.fields];
        newFields.splice(index + 1, 0, newField);
        setFormData({ ...formData, fields: newFields });
      }
    }
  };

  const handleWordImport = (fields: IFormField[]) => {
    setFormData({
      ...formData,
      fields: [...(formData.fields || []), ...fields],
    });
    setShowWordImport(false);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título del Formulario
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Introduce el título del formulario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <TextareaAutosize
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe el propósito del formulario"
            minRows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de fin
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Roles asignados
          </label>
          <div className="mt-2 space-y-2">
            {['gestor', 'coordinador_subred', 'coordinador_general'].map((role) => (
              <label key={role} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={formData.assignedRoles?.includes(role)}
                  onChange={(e) => {
                    const roles = e.target.checked
                      ? [...(formData.assignedRoles || []), role]
                      : formData.assignedRoles?.filter((r) => r !== role);
                    setFormData({ ...formData, assignedRoles: roles });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {role === 'gestor'
                    ? 'Gestor'
                    : role === 'coordinador_subred'
                    ? 'Coordinador de Subred'
                    : 'Coordinador General'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowMultipleResponses}
              onChange={(e) =>
                setFormData({ ...formData, allowMultipleResponses: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Permitir múltiples respuestas
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowResponseModification}
              onChange={(e) =>
                setFormData({ ...formData, allowResponseModification: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Permitir modificar respuestas enviadas
            </span>
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Campos del Formulario</h3>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowWordImport(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Word
            </button>
            <button
              type="button"
              onClick={() => handleAddField()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Campo
            </button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formData.fields?.map((field) => field.id) || []}
            strategy={verticalListSortingStrategy}
          >
            {formData.fields?.map((field) => (
              <FormField
                key={field.id}
                field={field}
                availableFields={formData.fields || []}
                onUpdate={(updates) => handleUpdateField(field.id, updates)}
                onDelete={() => handleDeleteField(field.id)}
                onDuplicate={() => handleDuplicateField(field.id)}
                onAddField={() => handleAddField(field.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar borrador
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Publicar
        </button>
      </div>

      {showWordImport && (
        <WordImport onImport={handleWordImport} onClose={() => setShowWordImport(false)} />
      )}
    </form>
  );
};

export default FormBuilder;
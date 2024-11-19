import React from 'react';
import { Copy, GripVertical, Plus, Trash2, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField as IFormField } from '../../types/form';
import TextareaAutosize from 'react-textarea-autosize';
import ConditionalRules from './ConditionalRules';

interface FormFieldProps {
  field: IFormField;
  availableFields: IFormField[];
  onUpdate: (updates: Partial<IFormField>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddField: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  availableFields,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddField,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addOption = () => {
    const options = [...(field.options || []), ''];
    onUpdate({ options });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(field.options || [])];
    options[index] = value;
    onUpdate({ options });
  };

  const removeOption = (index: number) => {
    const options = [...(field.options || [])];
    options.splice(index, 1);
    onUpdate({ options });
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
      e.preventDefault();
      removeOption(index);
      // Focus previous input if exists
      const prevInput = document.getElementById(`option-${field.id}-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const renderOptions = () => {
    const options = field.options || [''];
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Opciones
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-none">
                {field.type === 'radio' && (
                  <div className="w-4 h-4 rounded-full border border-gray-300" />
                )}
                {field.type === 'checkbox' && (
                  <div className="w-4 h-4 rounded border border-gray-300" />
                )}
                {field.type === 'select' && (
                  <span className="text-sm text-gray-500">{index + 1}.</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  id={`option-${field.id}-${index}`}
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={`Opción ${index + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="flex-none p-1 text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <Plus className="h-4 w-4 mr-1" />
          Añadir opción
        </button>
        <p className="text-sm text-gray-500 mt-1">
          Presiona Enter para añadir una nueva opción o Backspace para eliminar una opción vacía
        </p>
      </div>
    );
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors mb-4">
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...attributes} {...listeners} className="cursor-move p-2">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
        <button
          type="button"
          onClick={onDuplicate}
          className="p-1 text-gray-400 hover:text-gray-500"
          title="Duplicar campo"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-gray-500"
          title="Eliminar campo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Etiqueta
            </label>
            <TextareaAutosize
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Escribe la pregunta..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              value={field.type}
              onChange={(e) => onUpdate({ type: e.target.value as IFormField['type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="text">Texto corto</option>
              <option value="textarea">Texto largo</option>
              <option value="select">Lista desplegable</option>
              <option value="radio">Opción única</option>
              <option value="checkbox">Casillas de verificación</option>
              <option value="date">Fecha</option>
              <option value="number">Número</option>
              <option value="file">Archivo</option>
              <option value="section">Sección</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción (opcional)
          </label>
          <TextareaAutosize
            value={field.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Añade una descripción o ayuda..."
          />
        </div>

        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && renderOptions()}

        {field.type === 'file' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipos de archivo permitidos
              </label>
              <div className="mt-2 space-x-4">
                {['image/*', 'application/pdf'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={field.fileTypes?.includes(type)}
                      onChange={(e) => {
                        const types = new Set(field.fileTypes || []);
                        if (e.target.checked) {
                          types.add(type);
                        } else {
                          types.delete(type);
                        }
                        onUpdate({ fileTypes: Array.from(types) });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {type === 'image/*' ? 'Imágenes' : 'PDF'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tamaño máximo (MB)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={field.maxFileSize ? field.maxFileSize / (1024 * 1024) : 10}
                onChange={(e) =>
                  onUpdate({
                    maxFileSize: parseInt(e.target.value) * 1024 * 1024,
                  })
                }
                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={field.multiple}
                onChange={(e) => onUpdate({ multiple: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Permitir múltiples archivos
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Campo obligatorio</span>
        </div>

        <ConditionalRules
          rules={field.conditionalRules || []}
          onChange={(rules) => onUpdate({ conditionalRules: rules })}
          availableFields={availableFields}
          currentFieldId={field.id}
        />
      </div>

      <div className="mt-4 -mb-2 flex justify-center">
        <button
          type="button"
          onClick={onAddField}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Añadir campo
        </button>
      </div>
    </div>
  );
};

export default FormField;
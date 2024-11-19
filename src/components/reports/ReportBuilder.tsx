import React, { useState } from 'react';
import { Plus, Save, X, Upload, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Report, ReportSection } from '../../types/reports';
import WordTemplateImport from './WordTemplateImport';

interface ReportBuilderProps {
  initialData?: Report;
  onSubmit: (data: Partial<Report>) => void;
  onCancel: () => void;
}

interface SortableSectionProps {
  section: ReportSection;
  onUpdate: (id: string, updates: Partial<ReportSection>) => void;
  onDelete: (id: string) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, onUpdate, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => onDelete(section.id)}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <input
        type="text"
        value={section.title}
        onChange={(e) => onUpdate(section.id, { title: e.target.value })}
        className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Título de la sección"
      />
      <textarea
        value={section.content}
        onChange={(e) => onUpdate(section.id, { content: e.target.value })}
        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Contenido de la sección"
      />
    </div>
  );
};

const ReportBuilder: React.FC<ReportBuilderProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Report>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    sections: initialData?.sections || [],
    attachments: initialData?.attachments || [],
  });

  const [showWordImport, setShowWordImport] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formData.sections?.findIndex((section) => section.id === active.id);
      const newIndex = formData.sections?.findIndex((section) => section.id === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && formData.sections) {
        const newSections = arrayMove(formData.sections, oldIndex, newIndex).map(
          (section, index) => ({ ...section, order: index })
        );
        setFormData({ ...formData, sections: newSections });
      }
    }
  };

  const addSection = () => {
    const newSection: ReportSection = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      order: formData.sections?.length || 0,
    };
    setFormData({
      ...formData,
      sections: [...(formData.sections || []), newSection],
    });
  };

  const updateSection = (id: string, updates: Partial<ReportSection>) => {
    setFormData({
      ...formData,
      sections: formData.sections?.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    });
  };

  const deleteSection = (id: string) => {
    setFormData({
      ...formData,
      sections: formData.sections
        ?.filter((section) => section.id !== id)
        .map((section, index) => ({ ...section, order: index })),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleWordImport = (importedData: Partial<Report>) => {
    setFormData({
      ...formData,
      sections: [
        ...(formData.sections || []),
        ...(importedData.sections || []).map((section, index) => ({
          ...section,
          order: (formData.sections?.length || 0) + index,
        })),
      ],
    });
    setShowWordImport(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Título del Informe
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowWordImport(true)}
          className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          Importar Word
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Secciones del Informe</h3>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Sección
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formData.sections?.map((section) => section.id) || []}
            strategy={verticalListSortingStrategy}
          >
            {formData.sections?.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onUpdate={updateSection}
                onDelete={deleteSection}
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
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </button>
      </div>

      {showWordImport && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <WordTemplateImport
            onImport={handleWordImport}
            onClose={() => setShowWordImport(false)}
          />
        </div>
      )}
    </form>
  );
};

export default ReportBuilder;
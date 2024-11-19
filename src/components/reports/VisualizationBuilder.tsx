import React from 'react';
import { X } from 'lucide-react';
import { ReportVisualization, ChartType } from '../../types/report';
import { useFormStore } from '../../stores/formStore';

interface VisualizationBuilderProps {
  visualization: ReportVisualization;
  onChange: (visualization: ReportVisualization) => void;
  onDelete: () => void;
}

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'table', label: 'Tabla' },
  { value: 'bar', label: 'Gráfico de Barras' },
  { value: 'line', label: 'Gráfico de Líneas' },
  { value: 'pie', label: 'Gráfico Circular' },
];

const VisualizationBuilder: React.FC<VisualizationBuilderProps> = ({
  visualization,
  onChange,
  onDelete,
}) => {
  const { forms } = useFormStore();

  const getAvailableFields = () => {
    return visualization.formIds
      .map((formId) => forms.find((f) => f.id === formId))
      .filter(Boolean)
      .flatMap((form) => form!.fields);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            value={visualization.title}
            onChange={(e) =>
              onChange({ ...visualization, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Visualización
        </label>
        <select
          value={visualization.type}
          onChange={(e) =>
            onChange({ ...visualization, type: e.target.value as ChartType })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {chartTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Formularios
        </label>
        <div className="mt-2 space-y-2">
          {forms.map((form) => (
            <label key={form.id} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={visualization.formIds.includes(form.id)}
                onChange={(e) => {
                  const formIds = e.target.checked
                    ? [...visualization.formIds, form.id]
                    : visualization.formIds.filter((id) => id !== form.id);
                  onChange({ ...visualization, formIds });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{form.title}</span>
            </label>
          ))}
        </div>
      </div>

      {visualization.formIds.length > 0 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Campos a Mostrar
            </label>
            <div className="mt-2 space-y-2">
              {getAvailableFields().map((field) => (
                <label key={field.id} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={visualization.selectedFields.includes(field.id)}
                    onChange={(e) => {
                      const selectedFields = e.target.checked
                        ? [...visualization.selectedFields, field.id]
                        : visualization.selectedFields.filter(
                            (id) => id !== field.id
                          );
                      onChange({ ...visualization, selectedFields });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {field.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agrupar por
            </label>
            <select
              multiple
              value={visualization.groupBy || []}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                onChange({ ...visualization, groupBy: selectedOptions });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {getAvailableFields().map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default VisualizationBuilder;
import React from 'react';
import { Plus, X } from 'lucide-react';
import { ConditionalRule, FormField } from '../../types/form';

interface ConditionalRulesProps {
  rules: ConditionalRule[];
  onChange: (rules: ConditionalRule[]) => void;
  availableFields: FormField[];
  currentFieldId: string;
}

const ConditionalRules: React.FC<ConditionalRulesProps> = ({
  rules,
  onChange,
  availableFields,
  currentFieldId,
}) => {
  const addRule = () => {
    onChange([
      ...rules,
      {
        fieldId: '',
        operator: 'equals',
        value: '',
        jumpToFieldId: '',
      },
    ]);
  };

  const updateRule = (index: number, updates: Partial<ConditionalRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    onChange(newRules);
  };

  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    onChange(newRules);
  };

  // Filtrar campos disponibles para evitar referencias circulares
  const getAvailableTargetFields = () => {
    let foundCurrent = false;
    return availableFields.filter(field => {
      if (field.id === currentFieldId) {
        foundCurrent = true;
        return false;
      }
      return !foundCurrent; // Solo permitir saltos a campos posteriores
    });
  };

  // Filtrar campos disponibles para condiciones
  const getAvailableSourceFields = () => {
    return availableFields.filter(field => 
      field.id !== currentFieldId && 
      (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox')
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Lógica Condicional</h4>
        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-3 w-3 mr-1" />
          Añadir Regla
        </button>
      </div>

      {rules.map((rule, index) => (
        <div key={index} className="flex items-start space-x-2 bg-gray-50 p-3 rounded-md">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Si el campo</label>
              <select
                value={rule.fieldId}
                onChange={(e) => updateRule(index, { fieldId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Seleccionar campo</option>
                {getAvailableSourceFields().map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Operador</label>
              <select
                value={rule.operator}
                onChange={(e) => updateRule(index, { operator: e.target.value as ConditionalRule['operator'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="equals">es igual a</option>
                <option value="not_equals">no es igual a</option>
                <option value="contains">contiene</option>
                <option value="not_contains">no contiene</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Valor</label>
              <input
                type="text"
                value={rule.value}
                onChange={(e) => updateRule(index, { value: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Ir a</label>
              <select
                value={rule.jumpToFieldId}
                onChange={(e) => updateRule(index, { jumpToFieldId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Seleccionar destino</option>
                {getAvailableTargetFields().map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeRule(index)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {rules.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No hay reglas condicionales. Añade una regla para crear lógica de salto entre campos.
        </p>
      )}
    </div>
  );
};

export default ConditionalRules;
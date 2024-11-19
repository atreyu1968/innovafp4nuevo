import React, { useState } from 'react';
import { Save, Send } from 'lucide-react';
import { Report, ReportContent, Activity } from '../../types/reports';

interface ReportFormProps {
  initialData?: Report;
  onSubmit: (data: Partial<Report>, isDraft: boolean) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<ReportContent>>({
    objectives: initialData?.content.objectives || '',
    methodology: initialData?.content.methodology || '',
    activities: initialData?.content.activities || [],
    results: initialData?.content.results || '',
    conclusions: initialData?.content.conclusions || '',
  });

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      content: formData as ReportContent,
      status: isDraft ? 'draft' : 'submitted',
      updatedAt: new Date().toISOString(),
    }, isDraft);
  };

  return (
    <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Objetivos
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.objectives}
          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Metodología
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.methodology}
          onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resultados
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.results}
          onChange={(e) => setFormData({ ...formData, results: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Conclusiones
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.conclusions}
          onChange={(e) => setFormData({ ...formData, conclusions: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Borrador
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Informe
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
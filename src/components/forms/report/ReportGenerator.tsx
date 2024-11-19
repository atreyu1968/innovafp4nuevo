import React, { useState } from 'react';
import { FileText, Plus, Settings, Download } from 'lucide-react';
import { FormResponse } from '../../../types/form';
import { useFormStore } from '../../../stores/formStore';
import { useAuthStore } from '../../../stores/authStore';
import { useNotifications } from '../../notifications/NotificationProvider';
import { useReportStore } from '../../../stores/reportStore';
import DataSourceSelector from './DataSourceSelector';
import DataManipulator from './DataManipulator';
import TemplateSelector from './TemplateSelector';
import PermissionsSelector from './PermissionsSelector';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface ReportGeneratorProps {
  initialResponses: FormResponse[];
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ initialResponses, onClose }) => {
  const { forms } = useFormStore();
  const { user } = useAuthStore();
  const { addReport } = useReportStore();
  const { showNotification } = useNotifications();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedData, setSelectedData] = useState<{
    responses: FormResponse[];
    reportType: 'individual' | 'general';
    additionalSources: Array<{
      name: string;
      data: any[];
      headers: string[];
    }>;
    calculatedFields: Record<string, string>;
  }>({
    responses: initialResponses,
    reportType: 'general',
    additionalSources: [],
    calculatedFields: {},
  });

  const [template, setTemplate] = useState<{
    file: Blob;
    fields: string[];
    mappings: Record<string, string>;
  } | null>(null);

  const [permissions, setPermissions] = useState({
    users: [] as string[],
    subnets: [] as string[],
    roles: [] as string[],
  });

  const generateReport = async () => {
    try {
      if (!template) {
        showNotification('error', 'Debes seleccionar una plantilla');
        return;
      }

      if (!selectedData.responses.length) {
        showNotification('error', 'No hay datos seleccionados para el informe');
        return;
      }

      const reportsToGenerate = selectedData.reportType === 'individual' 
        ? selectedData.responses 
        : [selectedData.responses[0]];

      for (const response of reportsToGenerate) {
        // Leer la plantilla
        const arrayBuffer = await template.file.arrayBuffer();
        const templateContent = new TextDecoder().decode(arrayBuffer);

        // Reemplazar los campos
        let content = templateContent;
        template.fields.forEach(field => {
          const mappedField = template.mappings[field];
          let value = '';

          if (mappedField.startsWith('_')) {
            switch (mappedField) {
              case '_userName':
                value = response.userName;
                break;
              case '_userRole':
                value = response.userRole;
                break;
              case '_timestamp':
                value = new Date(response.submissionTimestamp || response.lastModifiedTimestamp).toLocaleString();
                break;
            }
          } else if (mappedField.startsWith('calc_')) {
            const calcField = mappedField.replace('calc_', '');
            value = selectedData.calculatedFields[calcField] || '';
          } else {
            value = response.responses[mappedField]?.toString() || '';
          }

          content = content.replace(`<<${field}>>`, value);
        });

        // Crear documento
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: content }),
                ],
              }),
            ],
          }],
        });

        // Generar archivo
        const buffer = await Packer.toBlob(doc);
        const fileName = selectedData.reportType === 'individual'
          ? `informe_${response.userName}_${new Date().toISOString()}.docx`
          : `informe_general_${new Date().toISOString()}.docx`;

        // Crear URL para el archivo
        const fileUrl = URL.createObjectURL(buffer);

        // Guardar en el store
        const reportId = crypto.randomUUID();
        addReport({
          id: reportId,
          title: selectedData.reportType === 'individual'
            ? `Informe - ${response.userName}`
            : 'Informe General',
          description: `Informe generado ${selectedData.reportType === 'individual' ? 'para ' + response.userName : 'para múltiples respuestas'}`,
          template: {
            url: URL.createObjectURL(template.file),
            fields: template.fields
          },
          data: {
            responses: selectedData.reportType === 'individual' ? [response] : selectedData.responses,
            additionalData: selectedData.additionalSources,
            calculatedFields: selectedData.calculatedFields
          },
          permissions: {
            users: permissions.users,
            subnets: permissions.subnets,
            roles: permissions.roles
          },
          output: {
            url: fileUrl,
            generatedAt: new Date().toISOString()
          },
          createdBy: user?.id || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Descargar archivo
        saveAs(buffer, fileName);
      }

      showNotification('success', 'Informe(s) generado(s) correctamente');
      onClose();
    } catch (error) {
      console.error('Error al generar el informe:', error);
      showNotification('error', 'Error al generar el informe');
    }
  };

  const steps = [
    {
      title: 'Seleccionar Datos',
      component: (
        <DataSourceSelector
          form={forms.find(f => f.id === initialResponses[0]?.formId)!}
          initialResponses={initialResponses}
          availableForms={forms}
          onDataSelected={setSelectedData}
        />
      )
    },
    {
      title: 'Manipular Datos',
      component: (
        <DataManipulator
          data={selectedData}
          onDataUpdated={setSelectedData}
          onNext={() => setCurrentStep(2)}
        />
      )
    },
    {
      title: 'Seleccionar Plantilla',
      component: (
        <TemplateSelector
          data={selectedData}
          onTemplateSelected={(templateData) => {
            setTemplate({
              file: templateData.file,
              fields: templateData.fields,
              mappings: templateData.mappings
            });
            setCurrentStep(3);
          }}
        />
      )
    },
    {
      title: 'Configurar Permisos',
      component: (
        <PermissionsSelector
          permissions={permissions}
          onPermissionsUpdated={setPermissions}
          onFinish={generateReport}
        />
      )
    }
  ];

  return (
    <div className="relative bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{steps[currentStep].title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        {steps[currentStep].component}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Anterior
        </button>
        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;
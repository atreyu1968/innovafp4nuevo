import { FormResponse } from '../types/form';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { useReportStore } from '../stores/reportStore';

interface GenerateReportParams {
  response: FormResponse;
  template: Blob;
  fields: string[];
  mappings: Record<string, string>;
}

export const generateReport = async ({
  response,
  template,
  fields,
  mappings,
}: GenerateReportParams): Promise<string> => {
  try {
    // Leer la plantilla
    const arrayBuffer = await template.arrayBuffer();
    const templateContent = new TextDecoder().decode(arrayBuffer);

    // Reemplazar los campos
    let content = templateContent;
    fields.forEach(field => {
      const mappedField = mappings[field];
      let value = '';

      // Obtener el valor según el tipo de campo
      if (mappedField.startsWith('_')) {
        // Campos especiales
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
        // Campo calculado
        const calcField = mappedField.replace('calc_', '');
        value = response.responses[calcField]?.toString() || '';
      } else {
        // Campo normal de respuesta
        value = response.responses[mappedField]?.toString() || '';
      }

      content = content.replace(`<<${field}>>`, value);
    });

    // Crear nuevo documento
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: content,
              }),
            ],
          }),
        ],
      }],
    });

    // Generar el archivo
    const buffer = await Packer.toBlob(doc);
    const fileName = `informe_${response.userName}_${new Date().toISOString()}.docx`;

    // Crear URL para el archivo
    const fileUrl = URL.createObjectURL(buffer);

    // Guardar el informe en el store
    const { addReport } = useReportStore.getState();
    const reportId = crypto.randomUUID();
    
    addReport({
      id: reportId,
      title: `Informe - ${response.userName}`,
      description: `Informe generado para la respuesta del formulario`,
      template: {
        url: URL.createObjectURL(template),
        fields: fields
      },
      data: {
        responses: [response],
        additionalData: [],
        calculatedFields: {}
      },
      permissions: {
        users: [response.userId],
        subnets: [],
        roles: [response.userRole]
      },
      output: {
        url: fileUrl,
        generatedAt: new Date().toISOString()
      },
      createdBy: response.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Descargar el archivo
    saveAs(buffer, fileName);

    return reportId;
  } catch (error) {
    console.error('Error al generar el informe:', error);
    throw error;
  }
};
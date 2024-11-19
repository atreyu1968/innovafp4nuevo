import { Form } from '../../types/form';

// Archivo vacío ya que eliminamos la plantilla
export const innovationFormTemplate: Form = {
  id: crypto.randomUUID(),
  title: '',
  description: '',
  fields: [],
  assignedRoles: [],
  academicYearId: '',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
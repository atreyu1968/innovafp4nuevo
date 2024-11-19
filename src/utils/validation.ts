import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  telefono: z.string().regex(/^\d{9}$/, 'El teléfono debe tener 9 dígitos'),
  familiaProfesional: z.string(),
  role: z.enum(['gestor', 'coordinador_subred', 'coordinador_general']),
  centro: z.string().optional(),
  subred: z.string().optional(),
  academicYearId: z.string(),
  active: z.boolean(),
});

export const formSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string(),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'radio', 'checkbox', 'date', 'number']),
    label: z.string().min(1, 'La etiqueta es obligatoria'),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
  })),
  assignedRoles: z.array(z.enum(['gestor', 'coordinador_subred', 'coordinador_general'])),
  academicYearId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

export const reportSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string(),
  visualizations: z.array(z.object({
    id: z.string(),
    type: z.enum(['bar', 'line', 'pie', 'table']),
    title: z.string(),
    description: z.string().optional(),
    formIds: z.array(z.string()),
    selectedFields: z.array(z.string()),
    filters: z.array(z.object({
      fieldId: z.string(),
      operator: z.enum(['equals', 'contains', 'greater', 'less', 'between']),
      value: z.any(),
    })),
    groupBy: z.array(z.string()).optional(),
    sortBy: z.object({
      field: z.string(),
      order: z.enum(['asc', 'desc']),
    }).optional(),
  })),
});
export type FormStatus = 'borrador' | 'publicado' | 'cerrado';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  fileTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  fields?: FormField[];
  conditionalRules?: ConditionalRule[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  assignedRoles: UserRole[];
  academicYearId: string;
  startDate?: string;
  endDate?: string;
  status: FormStatus;
  acceptingResponses: boolean;
  allowMultipleResponses: boolean;
  allowResponseModification: boolean; // Nueva propiedad
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  createdByName?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  academicYearId: string;
  responses: {
    [fieldId: string]: string | string[] | boolean | FileResponse[];
  };
  status: 'borrador' | 'enviado';
  responseTimestamp: string;
  lastModifiedTimestamp: string;
  submissionTimestamp?: string;
  version: number; // Nueva propiedad para control de versiones
  isModification?: boolean; // Nueva propiedad para indicar si es una modificación
  originalResponseId?: string; // Nueva propiedad para referenciar la respuesta original
}
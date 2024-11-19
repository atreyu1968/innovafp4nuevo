import { FormResponse } from './form';
import { UserRole } from './auth';

export interface Report {
  id: string;
  title: string;
  description?: string;
  template: {
    url: string;
    fields: string[];
  };
  data: {
    responses: FormResponse[];
    additionalData: Record<string, any>[];
    calculatedFields: Record<string, string>;
  };
  permissions: {
    users: string[];
    subnets: string[];
    roles: UserRole[];
  };
  output: {
    url: string;
    generatedAt: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  url: string;
  fields: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
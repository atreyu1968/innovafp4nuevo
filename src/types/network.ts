export type Island = 
  | 'Tenerife'
  | 'Gran Canaria'
  | 'Lanzarote'
  | 'La Palma'
  | 'La Gomera'
  | 'El Hierro'
  | 'Fuerteventura';

export interface CenterType {
  id: string;
  code: string;
  name: string;
  academicYearId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalFamily {
  id: string;
  code: string;
  name: string;
  academicYearId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subnet {
  id: string;
  name: string;
  island: Island;
  cifpId: string;
  academicYearId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EducationalCenter {
  id: string;
  code: string;
  name: string;
  typeId: string;
  island: Island;
  subnetId?: string;
  academicYearId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
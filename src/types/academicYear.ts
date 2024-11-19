export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'finished';
  description?: string;
}

export interface Center {
  id: string;
  name: string;
  type: 'CIFP' | 'IES';
  subnetId: string;
  academicYearId: string;
}
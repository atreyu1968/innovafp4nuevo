export interface ReportSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  authorId: string;
  centerId: string;
  subnetId?: string;
  academicYear: string;
  sections: ReportSection[];
  attachments?: string[];
}
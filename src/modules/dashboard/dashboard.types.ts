import type { ConsultationModel } from '@/generated/prisma/models/Consultation';
import type { UserModel } from '@/generated/prisma/models/User';

export type DashboardConsultationUser = Pick<
  UserModel,
  'id' | 'name' | 'image'
>;

export type DashboardConsultation = ConsultationModel & {
  user: DashboardConsultationUser;
};

export type PsychologistDashboardStats = {
  pendingConsultationCount: number;
  totalConsultationCount: number;
  completedConsultationCount: number;
  recentConsultations: DashboardConsultation[];
  completedConsultations: DashboardConsultation[];
};

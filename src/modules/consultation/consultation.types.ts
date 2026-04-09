import type { ConsultationStatus } from '@/generated/prisma/enums';

export type CreateConsultationInput = {
  title: string;
  nature: string;
  description: string;
  date: string;
  time: string;
  isAnonymous: boolean;
  document?: File | null;
};

export type ConsultationScheduleQueryInput = {
  date: string;
};

export type ConsultationScheduleSlot = {
  time: string;
  psychologistCount: number;
  bookedCount: number;
  available: boolean;
};

export type CreateConsultationRepositoryInput = {
  userId: string;
  psychologistId: string | null;
  title: string;
  category: string;
  description: string;
  date: Date;
  time: Date;
  isAnonymous: boolean;
  status: ConsultationStatus;
  attachmentUrl: string | null;
};

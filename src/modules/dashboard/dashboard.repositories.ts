import { prisma } from '@/lib/prisma';

import type { PsychologistDashboardStats } from './dashboard.types';

export const getPsychologistDashboardStats = async (
  psychologistId: string,
): Promise<PsychologistDashboardStats> => {
  // 1. Pending consultations
  const pendingConsultationCount = await prisma.consultation.count({
    where: { psychologistId, status: 'SCHEDULED' },
  });

  // 2. Total consultations
  const totalConsultationCount = await prisma.consultation.count({
    where: { psychologistId },
  });

  // 3. Completed consultations
  const completedConsultationCount = await prisma.consultation.count({
    where: { psychologistId, status: 'COMPLETED' },
  });

  // 4. Recent consultations (SCHEDULED)
  const recentConsultations = await prisma.consultation.findMany({
    where: { psychologistId, status: 'SCHEDULED' },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    take: 5,
  });

  // 5. Report status (COMPLETED)
  const completedConsultations = await prisma.consultation.findMany({
    where: { psychologistId, status: 'COMPLETED' },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: [{ date: 'desc' }, { time: 'desc' }],
    take: 5,
  });

  return {
    pendingConsultationCount,
    totalConsultationCount,
    completedConsultationCount,
    recentConsultations,
    completedConsultations,
  };
};

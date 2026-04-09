import { prisma } from '@/lib/prisma';

import type { CreateConsultationRepositoryInput } from './consultation.types';

type PsychologistScheduleRecord = {
  userId: string;
  startTime: Date;
  endTime: Date;
};

export const getPsychologistSchedulesByDay = async (
  dayOfWeek: number,
): Promise<PsychologistScheduleRecord[]> => {
  return prisma.schedule.findMany({
    where: { dayOfWeek },
    select: {
      userId: true,
      startTime: true,
      endTime: true,
    },
  });
};

export const getConsultationsByDate = async (date: Date) => {
  return prisma.consultation.findMany({
    where: { date },
    select: {
      time: true,
    },
  });
};

export const createConsultation = async (
  consultationData: CreateConsultationRepositoryInput,
) => {
  return prisma.consultation.create({
    data: consultationData,
  });
};

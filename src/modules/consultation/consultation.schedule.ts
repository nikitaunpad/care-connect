import {
  getConsultationsByDate,
  getPsychologistSchedulesByDay,
} from './consultation.repositories';
import type { ConsultationScheduleSlot } from './consultation.types';

export const jsDayToPrismaDay = (jsDay: number) => (jsDay === 0 ? 7 : jsDay);

export const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getHourlySlots = (startTime: Date, endTime: Date) => {
  const slots: string[] = [];
  const current = new Date(startTime);

  while (current < endTime) {
    slots.push(formatTime(current));
    current.setHours(current.getHours() + 1);
  }

  return slots;
};

export const getScheduleAvailabilityForDate = async (
  date: string,
): Promise<ConsultationScheduleSlot[]> => {
  const selectedDate = new Date(date);
  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error('Invalid date');
  }

  const dayOfWeek = jsDayToPrismaDay(selectedDate.getDay());
  const schedules = await getPsychologistSchedulesByDay(dayOfWeek);

  const slotsByTime = new Map<string, Set<string>>();

  schedules.forEach((schedule) => {
    const scheduleSlots = getHourlySlots(schedule.startTime, schedule.endTime);
    scheduleSlots.forEach((slot) => {
      const set = slotsByTime.get(slot) ?? new Set<string>();
      set.add(schedule.userId);
      slotsByTime.set(slot, set);
    });
  });

  if (slotsByTime.size === 0) {
    return [];
  }

  const consultations = await getConsultationsByDate(selectedDate);

  const bookingCountByTime = consultations.reduce<Record<string, number>>(
    (acc, consultation) => {
      const time = formatTime(consultation.time);
      acc[time] = (acc[time] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return Array.from(slotsByTime.entries())
    .map(([time, psychIds]) => {
      const psychologistCount = psychIds.size;
      const bookedCount = bookingCountByTime[time] ?? 0;
      return {
        time,
        psychologistCount,
        bookedCount,
        available: psychologistCount > bookedCount,
      };
    })
    .sort((a, b) => (a.time > b.time ? 1 : -1));
};

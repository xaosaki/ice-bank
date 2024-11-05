import { format } from 'date-fns';

export const formatDayDate = (date: string) => {
  return format(parseLocalDate(date), 'EEEE, do MMMM');
};

export function formatDateAndTime(dateString: string): string {
  return format(new Date(dateString), "EEEE, do MMMM 'at' HH:mm");
}

export function formatDateAndTimeShort(dateString: string): string {
  return format(new Date(dateString), 'EE, do MMM HH:mm');
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

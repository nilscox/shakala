/* eslint-disable import/no-duplicates */
import formatDateFns from 'date-fns/format';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import isBefore from 'date-fns/isBefore';
import { fr } from 'date-fns/locale';
import sub from 'date-fns/sub';

export enum DateFormat {
  date = "'Le' d MMMM yyyy",
  full = "'Le' d MMMM yyyy 'à' HH:mm",
}

export const createDate = (dateStr = '2000-01-01') => {
  return new Date(dateStr).toISOString();
};

export const formatDate = (date: string, format: string) => {
  return formatDateFns(new Date(date), format, { locale: fr });
};

export const formatDistanceToNow = (date: string) => {
  return formatDistanceToNowStrict(new Date(date), { locale: fr });
};

const isBefore24Hours = (date: string) => {
  return isBefore(new Date(date), sub(new Date(), { days: 1 }));
};

export const formatDateRelativeOrAbsolute = (date: string) => {
  if (isBefore24Hours(date)) {
    return formatDate(date, DateFormat.date);
  }

  return 'Il y a ' + formatDistanceToNow(date);
};

/* eslint-disable import/no-duplicates */
import formatDateFns from 'date-fns/format';
import formatDistanceToNowDateFns from 'date-fns/formatDistanceToNow';
import isBefore from 'date-fns/isBefore';
import { fr } from 'date-fns/locale';
import sub from 'date-fns/sub';

export enum DateFormat {
  date = "'Le' d MMMM yyyy",
  full = "'Le' d MMMM yyyy 'à' HH:mm",
}

export const formatDate = (date: string, format: string) => {
  return formatDateFns(new Date(date), format, { locale: fr });
};

export const formatDistanceToNow = (date: string) => {
  return formatDistanceToNowDateFns(new Date(date), { locale: fr });
};

export const isBefore24Hours = (date: string) => {
  return isBefore(new Date(date), sub(new Date(), { days: 1 }));
};

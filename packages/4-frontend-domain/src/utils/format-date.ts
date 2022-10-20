/* eslint-disable import/no-duplicates */
import formatDateFns from 'date-fns/format';
import { fr } from 'date-fns/locale';

export enum DateFormat {
  date = "'Le' d MMMM",
  full = "'Le' d MMMM yyyy 'à' HH:mm",
}

export const formatDate = (date: string, format: string) => {
  return formatDateFns(new Date(date), format, { locale: fr });
};

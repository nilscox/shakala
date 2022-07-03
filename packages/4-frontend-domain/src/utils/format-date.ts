/* eslint-disable import/no-duplicates */
import formatDateFns from 'date-fns/format';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string, format: string) => {
  return formatDateFns(new Date(date), format, { locale: fr });
};

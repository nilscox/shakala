import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';

type DateProps = {
  className?: string;
  date: string;
  format?: string;
};

export const Date = ({ className, date, format = 'd MMMM yyyy, HH:mm' }: DateProps): JSX.Element => (
  <time dateTime={date} className={className}>
    {formatDate(new global.Date(date), format, { locale: fr })}
  </time>
);

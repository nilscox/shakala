import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';

type DateProps = {
  className?: string;
  date: string;
  format: string;
  titleFormat?: string;
};

export const Date = ({ className, date, format, titleFormat }: DateProps): JSX.Element => (
  <time
    dateTime={date}
    className={className}
    title={titleFormat ? formatDate(new global.Date(date), titleFormat, { locale: fr }) : undefined}
  >
    {formatDate(new global.Date(date), format, { locale: fr })}
  </time>
);

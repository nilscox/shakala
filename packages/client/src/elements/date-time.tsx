import { formatDate, DateFormat } from '../utils/date-utils';

type DateTimeProps = {
  date: string;
  format?: DateFormat;
  title?: string;
  className?: string;
};

export const DateTime = ({
  date,
  format = DateFormat.date,
  title = formatDate(date, DateFormat.full),
  className,
}: DateTimeProps) => (
  <time dateTime={date} title={title} className={className}>
    {formatDate(date, format)}
  </time>
);

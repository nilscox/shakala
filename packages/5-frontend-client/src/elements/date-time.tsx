import { formatDate, DateFormat } from 'frontend-domain';

type DateTimeProps = {
  date: string;
};

export const DateTime = ({ date }: DateTimeProps) => (
  <time dateTime={date} title={formatDate(date, DateFormat.full)}>
    {formatDate(date, DateFormat.date)}
  </time>
);

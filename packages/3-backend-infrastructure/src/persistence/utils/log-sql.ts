import { QueryBuilder } from '@mikro-orm/postgresql';
import { format } from 'sql-formatter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logQueryBuilder = (qb: QueryBuilder<any>) => {
  console.log(format(qb.getFormattedQuery()));
};

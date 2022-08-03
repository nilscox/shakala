import { QueryBuilder } from '@mikro-orm/postgresql';
import { format } from 'sql-formatter';

export const logQueryBuilder = (qb: QueryBuilder<Partial<unknown>>) => {
  console.log(format(qb.getFormattedQuery()));
};

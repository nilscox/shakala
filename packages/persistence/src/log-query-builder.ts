import { QueryBuilder } from '@mikro-orm/postgresql';
import { format } from 'sql-formatter';

export const logQueryBuilder = <T extends object>(qb: QueryBuilder<T>) => {
  console.log(format(qb.getFormattedQuery()));
};

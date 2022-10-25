import { isEnumValue } from '../libs/is-enum-value';

export enum Sort {
  relevance = 'relevance',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}

export const isSort = isEnumValue(Sort);

export type HttpErrorBody = {
  /** unique error identifier */
  code: string;

  /** plain english error description */
  message: string;

  /** custom payload */
  details?: Record<string, unknown>;
};

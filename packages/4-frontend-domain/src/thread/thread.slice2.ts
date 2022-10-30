import { Normalized, normalized } from '@nilscox/redux-query';

import { schemas } from '../normalization';
import { Thread } from '../types';

type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

export const threadsReducer = normalized<NormalizedThread>(schemas, 'thread');

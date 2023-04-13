import { module as commonModule, TOKENS } from '@shakala/common';
import { Container } from 'brandi';

export const container = new Container();

container.use(TOKENS.logger).from(commonModule);
container.use(TOKENS.config).from(commonModule);

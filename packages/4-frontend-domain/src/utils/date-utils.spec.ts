import Sinon, { SinonFakeTimers } from 'sinon';

import { createDate, formatDateRelativeOrAbsolute } from './date-utils';

describe('formatDateRelativeOrAbsolute', () => {
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = Sinon.useFakeTimers();
    clock.setSystemTime(new Date('2022-01-02T12:00'));
  });

  afterEach(() => {
    clock.restore();
  });

  it('returns a distance to now when the activity was created within 24 hours', () => {
    const formatted = formatDateRelativeOrAbsolute(createDate('2022-01-02T10:00'));

    expect(formatted).toEqual('Il y a 2 heures');
  });

  it('returns the formatted date when the activity was created more than 24 hours ago', () => {
    const formatted = formatDateRelativeOrAbsolute(createDate('2022-01-01T10:00'));

    expect(formatted).toEqual('Le 1 janvier 2022');
  });
});

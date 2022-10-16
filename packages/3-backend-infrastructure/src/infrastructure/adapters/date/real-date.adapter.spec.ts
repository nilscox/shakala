import { useFakeTimers, SinonFakeTimers } from 'sinon';

import { RealDateAdapter } from './real-date.adapter';

describe('RealDateAdapter', () => {
  let clock: SinonFakeTimers;

  before(() => {
    clock = useFakeTimers();
  });

  after(() => {
    clock.restore();
  });

  it('returns the current date', () => {
    const now = new Date(2022, 0, 1);

    clock.setSystemTime(now);

    const adapter = new RealDateAdapter();

    expect(adapter.now()).toEqual(now);
    expect(adapter.nowAsString()).toEqual(now.toISOString());
  });
});

import { RealDateAdapter } from './real-date.adapter';

describe('RealDateAdapter', () => {
  it('returns the current date', () => {
    const now = new Date(2022, 0, 1);

    vi.setSystemTime(now);

    const adapter = new RealDateAdapter();

    expect(adapter.now()).toEqual(now);
    expect(adapter.nowAsString()).toEqual(now.toISOString());
  });
});

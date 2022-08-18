import { RealDateService } from './real-date.service';

describe('RealDateService', () => {
  it('returns the current date', () => {
    const now = new Date(2022, 0, 1);

    vi.setSystemTime(now);

    const service = new RealDateService();

    expect(service.now()).toEqual(now);
    expect(service.nowAsString()).toEqual(now.toISOString());
  });
});

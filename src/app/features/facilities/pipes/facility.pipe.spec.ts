import { FacilityPipe } from '@app/features/facilities/pipes/facility.pipe';

describe('FacilityPipe', () => {
  let pipe: FacilityPipe;

  beforeEach(() => {
    pipe = new FacilityPipe();
  });

  it('should load', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return expect result', () => {
    const transform = pipe.transform({
      exposure: {
        results: [{ results: [] }],
      },
      facility: { contracts: [] },
    });

    const expected = {
      credit: undefined,
      contracts: [],
      insurance: undefined,
      guarantors: [],
    };

    expect(transform.credit).toBeUndefined();
    expect(transform).toEqual(expected);
  });
});

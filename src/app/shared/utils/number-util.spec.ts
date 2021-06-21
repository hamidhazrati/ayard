import { isNegative } from '@app/shared/utils/number-util';

describe('Given a negative number', () => {
  it('should return true', () => {
    expect(isNegative(-1000000)).toBeTruthy();
  });
});

describe('Given a positive number', () => {
  it('should return false', () => {
    expect(isNegative(1000000)).toBeFalsy();
  });
});

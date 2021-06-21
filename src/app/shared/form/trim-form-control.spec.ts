import { TrimFormControl } from '@app/shared/form/trim-form-control';

describe('TrimFormControl', () => {
  test.each`
    value        | expected
    ${null}      | ${null}
    ${undefined} | ${undefined}
    ${''}        | ${''}
    ${' '}       | ${''}
    ${'\t'}      | ${''}
    ${' a'}      | ${'a'}
    ${'a '}      | ${'a'}
    ${' a '}     | ${'a'}
    ${' a  b  '} | ${'a  b'}
  `('should return "$expected" given "$value"', ({ value, expected }) => {
    const trimFormControl = new TrimFormControl();

    trimFormControl.value = value;

    expect(trimFormControl.value).toEqual(expected);
  });
});

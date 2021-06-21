import { FormControl } from '@ng-stack/forms';
import { positiveNumber } from '@app/shared/validators/positive-number.validator';

test.each`
  input      | valid
  ${-0.1}    | ${false}
  ${-1}      | ${false}
  ${0}       | ${false}
  ${0.00001} | ${true}
  ${1}       | ${true}
`('THEN input of "$input" should validate correctly', ({ input, valid }) => {
  const control = new FormControl<number>(input);
  const result = positiveNumber(control);

  expect(result).toEqual(valid ? null : { positive: { actual: input } });
});

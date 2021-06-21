import { FormControl } from '@ng-stack/forms';
import { minSupplied } from '@app/shared/validators/min-supplied.validator';

test.each`
  supplier           | input        | valid
  ${() => 1}         | ${0}         | ${false}
  ${() => 1}         | ${1}         | ${true}
  ${() => 1}         | ${2}         | ${true}
  ${() => 1}         | ${null}      | ${true}
  ${() => 1}         | ${undefined} | ${true}
  ${() => null}      | ${1}         | ${true}
  ${() => undefined} | ${1}         | ${true}
`(
  'THEN validator with input of "$input" should validate correctly',
  ({ supplier, input, valid }) => {
    const control = new FormControl<number>(input);
    const result = minSupplied(supplier)(control);

    expect(result).toEqual(valid ? null : { min: { actual: input, min: supplier() } });
  },
);

import { FormControl } from '@ng-stack/forms';
import { maxSupplied } from '@app/shared/validators/max-supplied.validator';

test.each`
  supplier           | input        | valid
  ${() => 1}         | ${2}         | ${false}
  ${() => 1}         | ${1}         | ${true}
  ${() => 1}         | ${0}         | ${true}
  ${() => 1}         | ${null}      | ${true}
  ${() => 1}         | ${undefined} | ${true}
  ${() => null}      | ${1}         | ${true}
  ${() => undefined} | ${1}         | ${true}
`(
  'THEN validator with input of "$input" should validate correctly',
  ({ supplier, input, valid }) => {
    const control = new FormControl<number>(input);
    const result = maxSupplied(supplier)(control);

    expect(result).toEqual(valid ? null : { max: { actual: input, max: supplier() } });
  },
);

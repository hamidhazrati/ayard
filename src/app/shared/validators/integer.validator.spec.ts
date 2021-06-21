import { FormControl } from '@ng-stack/forms';
import { integer } from '@app/shared/validators/integer.validator';

test.each`
  input        | valid
  ${1}         | ${true}
  ${2}         | ${true}
  ${-1}        | ${true}
  ${-999}      | ${true}
  ${15.1}      | ${false}
  ${1.234}     | ${false}
  ${1.2341}    | ${false}
  ${null}      | ${true}
  ${0}         | ${true}
  ${-0}        | ${true}
  ${undefined} | ${true}
  ${undefined} | ${true}
`('THEN validator with input of "$input" should validate correctly', ({ input, valid }) => {
  const control = new FormControl<number>(input);
  const result = integer(control);

  expect(result).toEqual(valid ? null : { integer: { actual: input } });
});

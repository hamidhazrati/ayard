import { FormControl } from '@ng-stack/forms';
import { multipleOf } from '@app/shared/validators/multiple-of.validator';

test.each`
  multiple | input        | valid
  ${1}     | ${1}         | ${true}
  ${2}     | ${1}         | ${false}
  ${5}     | ${5}         | ${true}
  ${5}     | ${10}        | ${true}
  ${5}     | ${14}        | ${false}
  ${5}     | ${15.1}      | ${false}
  ${0.001} | ${1.234}     | ${true}
  ${0.001} | ${1.2341}    | ${false}
  ${0.001} | ${null}      | ${true}
  ${0.001} | ${0}         | ${true}
  ${0.001} | ${-0}        | ${true}
  ${0.001} | ${undefined} | ${true}
  ${0.001} | ${undefined} | ${true}
`(
  'THEN validator with multiple of "$multiple" and input of "$input" should validate correctly',
  ({ multiple, input, valid }) => {
    const control = new FormControl<number>(input);
    const result = multipleOf(multiple)(control);

    expect(result).toEqual(valid ? null : { multipleOf: { multiple, actual: input } });
  },
);

import { FormControl } from '@ng-stack/forms';
import { regexp } from '@app/shared/validators/regexp.validator';

test.each`
  input    | valid
  ${'^a$'} | ${true}
  ${'**'}  | ${false}
  ${null}  | ${true}
`('THEN input of "$input" should validate correctly', ({ input, valid }) => {
  const control = new FormControl<number>(input);
  const result = regexp(control);

  expect(result).toEqual(valid ? null : { regexp: true });
});

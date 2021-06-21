import { ControlsHelper } from './controls-helper.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MockService } from 'ng-mocks';
import { ErrorsHelperService } from '@app/shared/form/errors-helper.service';
import Mocked = jest.Mocked;

describe('ErrorsHelperService', () => {
  let control: FormControl;
  let form: FormGroup;
  let errorMessages;
  const controlsHelper: Mocked<ControlsHelper> = MockService(ControlsHelper) as Mocked<
    ControlsHelper
  >;
  const errorsHelperService: ErrorsHelperService = new ErrorsHelperService(controlsHelper);

  beforeEach(() => {
    describe('GIVEN there is a control with errors', () => {
      control = new FormControl();
    });

    describe('GIVEN there is a form containing the control', () => {
      form = new FormBuilder().group({ name: control });
    });

    describe('GIVEN are a set of error messages', () => {
      errorMessages = {
        'name.required': 'Name is required',
      };
    });

    describe('WHEN the control is required', () => {
      control.setErrors({ required: true });
    });
  });

  describe('Should return correct error message', () => {
    let error: string;

    beforeEach(() => {
      describe('WHEN an error message is requested for a known control key', () => {
        controlsHelper.findControlKey.mockImplementation((f, g) => {
          expect(f).toBe(form);
          expect(g).toBe(control);
          return 'name';
        });

        error = errorsHelperService.getErrorMessage(control, form, errorMessages);
      });
    });

    test('THEN the result is the correct error message', () => {
      expect(error).toEqual(errorMessages['name.required']);
    });
  });

  describe('Should return error key if it is not in error messages', () => {
    let error: string;

    beforeEach(() => {
      describe('WHEN an error message is requested for an unknown control key', () => {
        controlsHelper.findControlKey.mockImplementation((f, g) => {
          return 'address';
        });

        error = errorsHelperService.getErrorMessage(control, form, errorMessages);
      });
    });

    test('THEN the result is the error key', () => {
      expect(error).toEqual('address.required');
    });
  });
});

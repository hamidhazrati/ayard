import { ControlsHelper } from './controls-helper.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

describe('ControlsHelper', () => {
  describe('GIVEN there is a form with controls', () => {
    const aControl: FormControl = new FormControl();
    const nestedControl: FormControl = new FormControl();

    const form: FormGroup = new FormBuilder().group({
      a: ['', Validators.required],
      b: ['', Validators.required],
      c: new FormArray([
        new FormGroup({ aa: new FormControl() }),
        new FormGroup({ ab: aControl }),
        new FormGroup({ ac: new FormControl() }),
      ]),
      d: new FormArray([
        new FormGroup({
          aa: new FormArray([new FormGroup({ aa: nestedControl })]),
        }),
      ]),
    });

    describe('GIVEN the helper', () => {
      const controlsHelper: ControlsHelper = new ControlsHelper();

      describe('GIVEN a control a control that is in the form', () => {
        const controlToFind: FormControl = aControl;

        describe('WHEN the control is searched for', () => {
          const result = controlsHelper.findControlKey(form, controlToFind);

          test('THEN the result is the correct key', () => {
            expect(result).toEqual('c.ab');
          });
        });
      });

      describe('GIVEN a control a nested control that is in the form', () => {
        const controlToFind: FormControl = nestedControl;

        describe('WHEN the control is searched for', () => {
          const result = controlsHelper.findControlKey(form, controlToFind);

          test('THEN the result is the correct key', () => {
            expect(result).toEqual('d.aa.aa');
          });
        });
      });

      describe('GIVEN a control that is not in the form', () => {
        const controlToFind: FormControl = new FormControl();

        describe('WHEN the control is searched for', () => {
          const result = controlsHelper.findControlKey(form, controlToFind);

          test('THEN the result is undefined', () => {
            expect(result).toEqual(undefined);
          });
        });
      });
    });
  });
});

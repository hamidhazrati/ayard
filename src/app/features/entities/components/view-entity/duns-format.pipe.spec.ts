import { DunsFormatPipe } from './duns-format.pipe';

describe('DunsFormatPipe', () => {
  const pipe: DunsFormatPipe = new DunsFormatPipe();

  describe('GIVEN a pipe is create', () => {
    test('THEN the component is valid', () => {
      expect(pipe).toBeDefined();
    });
    describe('WHEN transforming duns Number', () => {
      test('THEN number has hyphens in it', () => {
        const dunsNumber = '123456789';
        expect(pipe.transform(dunsNumber)).toEqual('12-345-6789');
      });
    });
    describe('WHEN transforming null Duns Number', () => {
      test('THEN number has hyphens in it', () => {
        const dunsNumber = null;
        expect(pipe.transform(dunsNumber)).toEqual('');
      });
    });
    describe('WHEN transforming old style duns Number', () => {
      test('THEN number has hyphens in it', () => {
        const dunsNumber = '12-345-6789';
        expect(pipe.transform(dunsNumber)).toEqual('12-345-6789');
      });
    });
  });
});

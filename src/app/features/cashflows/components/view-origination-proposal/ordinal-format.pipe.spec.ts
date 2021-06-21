import { OrdinalFormatPipe } from './ordinal-format.pipe';

describe('OrdinalFormatPipe', () => {
  const pipe: OrdinalFormatPipe = new OrdinalFormatPipe();

  describe('GIVEN a pipe is create', () => {
    test('THEN the component is valid', () => {
      expect(pipe).toBeDefined();
    });
    describe('WHEN transforming a number', () => {
      test('THEN number has ordinal', () => {
        expect(pipe.transform(1)).toEqual('1st');
        expect(pipe.transform(2)).toEqual('2nd');
        expect(pipe.transform(3)).toEqual('3rd');
        expect(pipe.transform(4)).toEqual('4th');
        expect(pipe.transform(5)).toEqual('5th');
        expect(pipe.transform(10)).toEqual('10th');
        expect(pipe.transform(21)).toEqual('21st');
        expect(pipe.transform(22)).toEqual('22nd');
        expect(pipe.transform(23)).toEqual('23rd');
        expect(pipe.transform(24)).toEqual('24th');
      });
    });
    describe('WHEN transforming null number', () => {
      test('THEN output is empty', () => {
        expect(pipe.transform(null)).toEqual('');
      });
    });
  });
});

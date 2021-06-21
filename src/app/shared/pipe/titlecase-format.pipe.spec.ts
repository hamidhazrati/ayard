import { TitleCaseFormatPipe } from './titlecase-format.pipe';

describe('TitlecaseFormatPipe', () => {
  const pipe: TitleCaseFormatPipe = new TitleCaseFormatPipe();

  describe('GIVEN a pipe is create', () => {
    test('THEN the component is valid', () => {
      expect(pipe).toBeDefined();
    });
    describe('WHEN transforming TitleCase', () => {
      test('THEN String is converted to title case', () => {
        const status = 'PENDING_APPROVAL';
        expect(pipe.transform(status)).toEqual('Pending Approval');
      });
    });

    describe('WHEN null is sent', () => {
      test('THEN null should be received.', () => {
        expect(pipe.transform(null)).toBeNull();
      });
    });
  });
});

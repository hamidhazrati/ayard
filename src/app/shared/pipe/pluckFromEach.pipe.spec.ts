import { PluckFromEachPipe } from './pluckFromEach.pipe';

describe('PluckPipe', () => {
  it('create an instance', () => {
    const pipe = new PluckFromEachPipe();
    expect(pipe).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { UtilService } from '@app/shared/util/util.service';
import { CommonModule } from '@angular/common';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [UtilService],
    });

    service = TestBed.inject(UtilService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should get the right country name', () => {
    expect(service.getCountryName('US')).toEqual('United States');
    expect(service.getCountryName('ZZ')).toEqual('');
  });

  it('should capitalize as expected.', () => {
    expect(service.capitalize('hello world')).toEqual('Hello World');
  });

  it('should return a blank string.', () => {
    expect(service.capitalize(null)).toEqual('');
  });

  it('should indicate whether my number is negative or not.', () => {
    expect(service.isNegative(-1)).toBe(true);
    expect(service.isNegative(5)).toBe(false);
  });
});

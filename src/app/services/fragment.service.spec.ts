import { TestBed, inject } from '@angular/core/testing';
import { FragmentService } from './fragment.service';

describe('FragmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FragmentService]
    });
  });

  it(
    'should be created',
    inject([FragmentService], (service: FragmentService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'should properly parse query params',
    inject([FragmentService], (service: FragmentService) => {
      expect(service.parseFragment('1=2&3=4')).toEqual({ 1: '2', 3: '4' });
      expect(service.parseFragment('access_token=token&expires_in=3600')).toEqual({
        access_token: 'token',
        expires_in: '3600'
      });
      expect(service.parseFragment('')).toEqual({});
    })
  );
});

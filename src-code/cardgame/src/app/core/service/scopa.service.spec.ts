import { TestBed } from '@angular/core/testing';

import { ScopaService } from './scopa.service';

describe('ScopaService', () => {
  let service: ScopaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScopaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

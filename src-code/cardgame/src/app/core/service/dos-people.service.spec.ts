import { TestBed } from '@angular/core/testing';

import { DosPeopleService } from './dos-people.service';

describe('DosPeopleService', () => {
  let service: DosPeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosPeopleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

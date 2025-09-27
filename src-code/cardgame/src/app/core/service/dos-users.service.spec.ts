import { TestBed } from '@angular/core/testing';

import { DosUsersService } from './dos-users.service';

describe('DosUsersService', () => {
  let service: DosUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

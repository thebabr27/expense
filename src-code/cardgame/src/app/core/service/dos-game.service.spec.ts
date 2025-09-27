import { TestBed } from '@angular/core/testing';

import { DosGameService } from './dos-game.service';

describe('DosGameService', () => {
  let service: DosGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

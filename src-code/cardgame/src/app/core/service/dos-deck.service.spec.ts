import { TestBed } from '@angular/core/testing';

import { DosDeckService } from './dos-deck.service';

describe('DosDeckService', () => {
  let service: DosDeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosDeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

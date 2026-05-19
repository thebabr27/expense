import { TestBed } from '@angular/core/testing';

import { FullScreenModalService } from './full-screen-modal.service';

describe('FullScreenModalService', () => {
  let service: FullScreenModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullScreenModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

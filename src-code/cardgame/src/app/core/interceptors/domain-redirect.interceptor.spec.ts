import { TestBed } from '@angular/core/testing';

import { DomainRedirectInterceptor } from './domain-redirect.interceptor';

describe('DomainRedirectInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DomainRedirectInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DomainRedirectInterceptor = TestBed.inject(DomainRedirectInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

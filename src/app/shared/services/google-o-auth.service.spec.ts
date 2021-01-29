import { TestBed } from '@angular/core/testing';

import { GoogleOAuthService } from './google-o-auth.service';

describe('GoogleOAuthService', () => {
  let service: GoogleOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

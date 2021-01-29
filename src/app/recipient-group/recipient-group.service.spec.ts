import { TestBed } from '@angular/core/testing';

import { RecipientGroupService } from './recipient-group.service';

describe('RecipientGroupService', () => {
  let service: RecipientGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipientGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

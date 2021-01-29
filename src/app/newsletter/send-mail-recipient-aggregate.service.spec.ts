import { TestBed } from '@angular/core/testing';

import { SendMailRecipientAggregateService } from './send-mail-recipient-aggregate.service';

describe('SendMailRecipientAggregateService', () => {
  let service: SendMailRecipientAggregateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendMailRecipientAggregateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

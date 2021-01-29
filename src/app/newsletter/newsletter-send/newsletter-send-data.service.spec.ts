import { TestBed } from '@angular/core/testing';
import { NewsletterSendDataService } from "./newsletter-send-data.service";

describe('NewsletterSendDataService', () => {
  let service: NewsletterSendDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsletterSendDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

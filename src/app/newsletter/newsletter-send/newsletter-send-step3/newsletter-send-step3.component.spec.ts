import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSendStep3Component } from './newsletter-send-step3.component';

describe('NewsletterSendStep3Component', () => {
  let component: NewsletterSendStep3Component;
  let fixture: ComponentFixture<NewsletterSendStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsletterSendStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterSendStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

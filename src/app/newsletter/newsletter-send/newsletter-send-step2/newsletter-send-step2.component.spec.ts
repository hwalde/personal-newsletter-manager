import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSendStep2Component } from './newsletter-send-step2.component';

describe('NewsletterSendStep2Component', () => {
  let component: NewsletterSendStep2Component;
  let fixture: ComponentFixture<NewsletterSendStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsletterSendStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterSendStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSendStep1Component } from './newsletter-send-step1.component';

describe('NewsletterSendStep1Component', () => {
  let component: NewsletterSendStep1Component;
  let fixture: ComponentFixture<NewsletterSendStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsletterSendStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterSendStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

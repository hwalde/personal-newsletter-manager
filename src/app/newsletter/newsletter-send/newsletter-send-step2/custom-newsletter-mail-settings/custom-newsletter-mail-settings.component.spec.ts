import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNewsletterMailSettingsComponent } from './custom-newsletter-mail-settings.component';

describe('CustomNewsletterMailSettingsComponent', () => {
  let component: CustomNewsletterMailSettingsComponent;
  let fixture: ComponentFixture<CustomNewsletterMailSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomNewsletterMailSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNewsletterMailSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterDeleteDialogComponent } from './newsletter-delete-dialog.component';

describe('NewsletterDeleteDialogComponent', () => {
  let component: NewsletterDeleteDialogComponent;
  let fixture: ComponentFixture<NewsletterDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsletterDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

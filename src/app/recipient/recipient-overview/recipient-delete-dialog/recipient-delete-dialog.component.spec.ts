import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientDeleteDialogComponent } from './recipient-delete-dialog.component';

describe('RecipientDeleteDialogComponent', () => {
  let component: RecipientDeleteDialogComponent;
  let fixture: ComponentFixture<RecipientDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

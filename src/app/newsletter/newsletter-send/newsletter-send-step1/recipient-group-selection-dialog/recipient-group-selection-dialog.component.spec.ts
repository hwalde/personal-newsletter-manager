import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientGroupSelectionDialogComponent } from './recipient-group-selection-dialog.component';

describe('RecipientGroupSelectionDialogComponent', () => {
  let component: RecipientGroupSelectionDialogComponent;
  let fixture: ComponentFixture<RecipientGroupSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientGroupSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientGroupSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

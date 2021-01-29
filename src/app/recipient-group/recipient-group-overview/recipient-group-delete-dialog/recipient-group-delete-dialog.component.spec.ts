import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientGroupDeleteDialogComponent } from './recipient-group-delete-dialog.component';

describe('RecipientDeleteDialogComponent', () => {
  let component: RecipientGroupDeleteDialogComponent;
  let fixture: ComponentFixture<RecipientGroupDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipientGroupDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientGroupDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

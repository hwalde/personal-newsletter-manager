import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { RecipientOverviewComponent } from './recipient-overview.component';

describe('RecipientOverviewComponent', () => {
  let component: RecipientOverviewComponent;
  let fixture: ComponentFixture<RecipientOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientOverviewComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

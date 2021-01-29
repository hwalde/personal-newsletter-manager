import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { NewsletterOverviewComponent } from './newsletter-overview.component';

describe('NewsletterOverviewComponent', () => {
  let component: NewsletterOverviewComponent;
  let fixture: ComponentFixture<NewsletterOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsletterOverviewComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

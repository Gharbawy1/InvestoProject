import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentSidebarComponent } from './investment-sidebar.component';

describe('InvestmentSidebarComponent', () => {
  let component: InvestmentSidebarComponent;
  let fixture: ComponentFixture<InvestmentSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

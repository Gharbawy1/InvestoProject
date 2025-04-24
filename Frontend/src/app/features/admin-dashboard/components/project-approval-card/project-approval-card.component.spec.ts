import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectApprovalCardComponent } from './project-approval-card.component';

describe('ProjectApprovalCardComponent', () => {
  let component: ProjectApprovalCardComponent;
  let fixture: ComponentFixture<ProjectApprovalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectApprovalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectApprovalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBusinessDemoComponent } from './schedule-business-demo.component';

describe('ScheduleBusinessDemoComponent', () => {
  let component: ScheduleBusinessDemoComponent;
  let fixture: ComponentFixture<ScheduleBusinessDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleBusinessDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleBusinessDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

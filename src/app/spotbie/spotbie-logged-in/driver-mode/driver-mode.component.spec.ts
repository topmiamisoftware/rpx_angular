import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverModeComponent } from './driver-mode.component';

describe('DriverModeComponent', () => {
  let component: DriverModeComponent;
  let fixture: ComponentFixture<DriverModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

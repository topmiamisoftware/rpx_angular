import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsedComponent } from './endorsed.component';

describe('EndorsedComponent', () => {
  let component: EndorsedComponent;
  let fixture: ComponentFixture<EndorsedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndorsedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

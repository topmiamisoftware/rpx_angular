import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingPeopleComponent } from './missing-people.component';

describe('MissingPeopleComponent', () => {
  let component: MissingPeopleComponent;
  let fixture: ComponentFixture<MissingPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

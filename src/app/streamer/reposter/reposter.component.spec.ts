import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReposterComponent } from './reposter.component';

describe('ReposterComponent', () => {
  let component: ReposterComponent;
  let fixture: ComponentFixture<ReposterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReposterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReposterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

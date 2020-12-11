import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAdComponent } from './single-ad.component';

describe('SingleAdComponent', () => {
  let component: SingleAdComponent;
  let fixture: ComponentFixture<SingleAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

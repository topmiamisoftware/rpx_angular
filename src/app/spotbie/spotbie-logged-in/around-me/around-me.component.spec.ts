import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AroundMeComponent } from './around-me.component';

describe('AroundMeComponent', () => {
  let component: AroundMeComponent;
  let fixture: ComponentFixture<AroundMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AroundMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AroundMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

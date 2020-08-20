import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AroundMeActionsComponent } from './around-me-actions.component';

describe('AroundMeActionsComponent', () => {
  let component: AroundMeActionsComponent;
  let fixture: ComponentFixture<AroundMeActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AroundMeActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AroundMeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

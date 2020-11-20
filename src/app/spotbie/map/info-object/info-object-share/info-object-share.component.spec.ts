import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoObjectShareComponent } from './info-object-share.component';

describe('InfoObjectShareComponent', () => {
  let component: InfoObjectShareComponent;
  let fixture: ComponentFixture<InfoObjectShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoObjectShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoObjectShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

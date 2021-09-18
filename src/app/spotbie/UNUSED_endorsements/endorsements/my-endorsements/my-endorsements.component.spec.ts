import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEndorsementsComponent } from './my-endorsements.component';

describe('MyEndorsementsComponent', () => {
  let component: MyEndorsementsComponent;
  let fixture: ComponentFixture<MyEndorsementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEndorsementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEndorsementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

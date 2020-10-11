import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendActionsComponent } from './friend-actions.component';

describe('FriendActionsComponent', () => {
  let component: FriendActionsComponent;
  let fixture: ComponentFixture<FriendActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

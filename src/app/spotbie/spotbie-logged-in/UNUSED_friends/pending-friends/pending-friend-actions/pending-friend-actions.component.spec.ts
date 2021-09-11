import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFriendActionsComponent } from './pending-friend-actions.component';

describe('PendingFriendActionsComponent', () => {
  let component: PendingFriendActionsComponent;
  let fixture: ComponentFixture<PendingFriendActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingFriendActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingFriendActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

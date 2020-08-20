import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendNotificationsComponent } from './friend-notifications.component';

describe('FriendNotificationsComponent', () => {
  let component: FriendNotificationsComponent;
  let fixture: ComponentFixture<FriendNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

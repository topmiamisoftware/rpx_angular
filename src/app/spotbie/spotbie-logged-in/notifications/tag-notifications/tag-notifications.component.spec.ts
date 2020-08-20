import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagNotificationsComponent } from './tag-notifications.component';

describe('TagNotificationsComponent', () => {
  let component: TagNotificationsComponent;
  let fixture: ComponentFixture<TagNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

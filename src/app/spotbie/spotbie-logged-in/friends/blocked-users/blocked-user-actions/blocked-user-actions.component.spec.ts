import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedUserActionsComponent } from './blocked-user-actions.component';

describe('BlockedUserActionsComponent', () => {
  let component: BlockedUserActionsComponent;
  let fixture: ComponentFixture<BlockedUserActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockedUserActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedUserActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

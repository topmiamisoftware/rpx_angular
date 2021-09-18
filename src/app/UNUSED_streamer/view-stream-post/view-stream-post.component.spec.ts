import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStreamPostComponent } from './view-stream-post.component';

describe('ViewStreamPostComponent', () => {
  let component: ViewStreamPostComponent;
  let fixture: ComponentFixture<ViewStreamPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStreamPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStreamPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

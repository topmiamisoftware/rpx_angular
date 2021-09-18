import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPostComponent } from './stream-post.component';

describe('StreamPostComponent', () => {
  let component: StreamPostComponent;
  let fixture: ComponentFixture<StreamPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});

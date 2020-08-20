import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPosterComponent } from './stream-poster.component';

describe('StreamPosterComponent', () => {
  let component: StreamPosterComponent;
  let fixture: ComponentFixture<StreamPosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamPosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamPosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPlayerMainComponent } from './media-player-main.component';

describe('MediaPlayerMainComponent', () => {
  let component: MediaPlayerMainComponent;
  let fixture: ComponentFixture<MediaPlayerMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaPlayerMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaPlayerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

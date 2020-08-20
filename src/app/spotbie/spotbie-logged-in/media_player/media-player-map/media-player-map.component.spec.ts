import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPlayerMapComponent } from './media-player-map.component';

describe('MediaPlayerMapComponent', () => {
  let component: MediaPlayerMapComponent;
  let fixture: ComponentFixture<MediaPlayerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaPlayerMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaPlayerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

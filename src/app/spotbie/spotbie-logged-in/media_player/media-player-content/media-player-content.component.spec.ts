import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPlayerContentComponent } from './media-player-content.component';

describe('MediaPlayerContentComponent', () => {
  let component: MediaPlayerContentComponent;
  let fixture: ComponentFixture<MediaPlayerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaPlayerContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaPlayerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

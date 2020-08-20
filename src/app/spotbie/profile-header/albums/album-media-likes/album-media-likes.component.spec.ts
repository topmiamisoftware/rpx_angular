import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumMediaLikesComponent } from './album-media-likes.component';

describe('AlbumMediaLikesComponent', () => {
  let component: AlbumMediaLikesComponent;
  let fixture: ComponentFixture<AlbumMediaLikesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumMediaLikesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumMediaLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

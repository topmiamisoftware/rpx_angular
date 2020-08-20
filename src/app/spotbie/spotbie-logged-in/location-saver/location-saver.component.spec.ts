import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSaverComponent } from './location-saver.component';

describe('LocationSaverComponent', () => {
  let component: LocationSaverComponent;
  let fixture: ComponentFixture<LocationSaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSaverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

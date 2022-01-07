import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiseMyBusinessComponent } from './advertise-my-business.component';

describe('AdvertiseMyBusinessComponent', () => {
  let component: AdvertiseMyBusinessComponent;
  let fixture: ComponentFixture<AdvertiseMyBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertiseMyBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiseMyBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

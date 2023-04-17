import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoesItWorkComponent } from './does-it-work.component';

describe('DoesItWorkComponent', () => {
  let component: DoesItWorkComponent;
  let fixture: ComponentFixture<DoesItWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoesItWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoesItWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

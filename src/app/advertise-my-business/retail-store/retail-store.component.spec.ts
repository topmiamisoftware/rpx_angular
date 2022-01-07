import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailStoreComponent } from './retail-store.component';

describe('RetailStoreComponent', () => {
  let component: RetailStoreComponent;
  let fixture: ComponentFixture<RetailStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

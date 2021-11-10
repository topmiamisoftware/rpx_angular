import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadMobileComponent } from './download-mobile.component';

describe('DownloadMobileComponent', () => {
  let component: DownloadMobileComponent;
  let fixture: ComponentFixture<DownloadMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

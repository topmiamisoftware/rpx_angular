import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloadBusinessMobileComponent} from './download-business-mobile.component';

describe('DownloadBusinessMobileComponent', () => {
  let component: DownloadBusinessMobileComponent;
  let fixture: ComponentFixture<DownloadBusinessMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadBusinessMobileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadBusinessMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

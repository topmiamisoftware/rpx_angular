import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppPage } from './download-app.page';

describe('DownloadAppComponent', () => {
  let component: DownloadAppPage;
  let fixture: ComponentFixture<DownloadAppPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadAppPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

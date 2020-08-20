import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareMediaComponent } from './share-media.component';

describe('ShareMediaComponent', () => {
  let component: ShareMediaComponent;
  let fixture: ComponentFixture<ShareMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

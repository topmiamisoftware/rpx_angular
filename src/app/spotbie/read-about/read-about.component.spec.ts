import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadAboutComponent } from './read-about.component';

describe('ReadAboutComponent', () => {
  let component: ReadAboutComponent;
  let fixture: ComponentFixture<ReadAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPostEditorComponent } from './stream-post-editor.component';

describe('StreamPostEditorComponent', () => {
  let component: StreamPostEditorComponent;
  let fixture: ComponentFixture<StreamPostEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamPostEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamPostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

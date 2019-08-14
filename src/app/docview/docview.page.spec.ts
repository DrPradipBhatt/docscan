import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocviewPage } from './docview.page';

describe('DocviewPage', () => {
  let component: DocviewPage;
  let fixture: ComponentFixture<DocviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCategoryComponent } from './news-category.component';

describe('NewsCategoryComponent', () => {
  let component: NewsCategoryComponent;
  let fixture: ComponentFixture<NewsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

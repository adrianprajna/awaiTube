import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentCategoryComponent } from './entertainment-category.component';

describe('EntertainmentCategoryComponent', () => {
  let component: EntertainmentCategoryComponent;
  let fixture: ComponentFixture<EntertainmentCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertainmentCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertainmentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

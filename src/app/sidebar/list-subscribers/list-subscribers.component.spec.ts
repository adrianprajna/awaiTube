import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubscribersComponent } from './list-subscribers.component';

describe('ListSubscribersComponent', () => {
  let component: ListSubscribersComponent;
  let fixture: ComponentFixture<ListSubscribersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubscribersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

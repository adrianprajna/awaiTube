import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardModalComponent } from './keyboard-modal.component';

describe('KeyboardModalComponent', () => {
  let component: KeyboardModalComponent;
  let fixture: ComponentFixture<KeyboardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

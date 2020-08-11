import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCustomizeComponent } from './channel-customize.component';

describe('ChannelCustomizeComponent', () => {
  let component: ChannelCustomizeComponent;
  let fixture: ComponentFixture<ChannelCustomizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelCustomizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

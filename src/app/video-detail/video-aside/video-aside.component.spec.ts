import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAsideComponent } from './video-aside.component';

describe('VideoAsideComponent', () => {
  let component: VideoAsideComponent;
  let fixture: ComponentFixture<VideoAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

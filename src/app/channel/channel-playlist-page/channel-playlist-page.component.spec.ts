import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPlaylistPageComponent } from './channel-playlist-page.component';

describe('ChannelPlaylistPageComponent', () => {
  let component: ChannelPlaylistPageComponent;
  let fixture: ComponentFixture<ChannelPlaylistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelPlaylistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelPlaylistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

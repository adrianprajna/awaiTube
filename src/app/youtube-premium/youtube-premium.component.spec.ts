import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubePremiumComponent } from './youtube-premium.component';

describe('YoutubePremiumComponent', () => {
  let component: YoutubePremiumComponent;
  let fixture: ComponentFixture<YoutubePremiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YoutubePremiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubePremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

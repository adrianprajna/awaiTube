import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit {

  x = [
    12,
    13,
    14
  ]

  constructor() { }

  ngOnInit(): void {
  }

}

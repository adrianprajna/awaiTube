import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-category',
  templateUrl: './music-category.component.html',
  styleUrls: ['./music-category.component.scss']
})
export class MusicCategoryComponent implements OnInit {

  lists = [
    {
      name: 'William',
      link: '../../assets/videos/sample-video.m4v'
    },
    {
      name: 'Eric Saputro',
      link: '../../assets/videos/video.mp4'
    },
    {
      name: 'Adrian',
      link: ''
    },
    {
      name: 'Andrew Tanjaya',
      link: ''
    },
    {
      name: 'DX',
      link: ''
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}

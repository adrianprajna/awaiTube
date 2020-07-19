import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-category',
  templateUrl: './music-category.component.html',
  styleUrls: ['./music-category.component.scss']
})
export class MusicCategoryComponent implements OnInit {

  lists = [
    {
      id: 1,
      name: 'William',
      link: '../../assets/videos/sample-video.m4v'
    },
    {
      id: 2,
      name: 'Eric Saputro',
      link: '../../assets/videos/video.mp4'
    },
    {
      id: 3,
      name: 'Adrian',
      link: ''
    },
    {
      id: 4,
      name: 'Andrew Tanjaya',
      link: ''
    },
    {
      id: 5,
      name: 'DX',
      link: ''
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}

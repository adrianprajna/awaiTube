import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isSettingsDrop = false;

  lists = [
    {
      id: 1,
      name: 'Vendly Tanudjaja',
      link: '../../assets/videos/sample-video.m4v'
    },
    {
      id: 2,
      name: 'Eric Saputro',
      link: '../../assets/videos/video.mp4'
    }
  ]
  constructor() { }

  ngOnInit(): void {
    console.log(this.lists)
  }

  addDropdown(): void{
    this.isSettingsDrop = !this.isSettingsDrop;
  }
}

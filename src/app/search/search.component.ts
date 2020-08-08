import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { PlaylistService } from '../playlist.service';
import { UserService } from '../services/user.service';
import { User } from '../type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService, private playlistService: PlaylistService, private userService: UserService) { }

  url: string;
  videos: any;
  playlists: any
  users: Array<User>
  date = new Date();

  isFilterDrop: boolean = false;


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
        this.url = params.get('url');
        this.getAllVideos("first");
        this.getAllPlaylist();
        this.getAllChannel();
    })
  }

  getAllVideos(filter: string){
    this.url = `%${this.url}%`
    this.videoService.getAllVideosByTitle(this.url).valueChanges
      .subscribe(res => {
        this.videos = res.data.getAllVideosByTitle
        
        if(filter == "year"){
          this.videos = Array.from(this.videos).filter((vid: any) => vid.year == this.date.getFullYear());
        }
        else if(filter == "month"){
          this.videos = Array.from(this.videos).filter((vid: any) => vid.year == this.date.getFullYear());
          this.videos = Array.from(this.videos).filter((vid: any) => vid.month == this.date.getMonth() + 1);
        }
        else if(filter == "week"){
          this.videos = Array.from(this.videos).filter((vid: any) => vid.year == this.date.getFullYear());
          this.videos = Array.from(this.videos).filter((vid: any) => vid.month == this.date.getMonth() + 1);
          this.videos = Array.from(this.videos).filter((vid: any) => vid.day > this.date.getDate() - 6)
        } 
      });
  }

  getAllPlaylist() {
    this.url = `%${this.url}%`;
    this.playlistService.getAllPlaylists(this.url).valueChanges
      .subscribe(result => {
        this.playlists = result.data.playlists     
      })
  }

  getAllChannel(){
    this.url = `%${this.url}%`;
    this.userService.getAllUsers(this.url).valueChanges
      .subscribe(result => {
        this.users = result.data.getAllUsers
      })
  }

  setFilter(){
    this.isFilterDrop = !this.isFilterDrop;
  }

  getByMonth(){
    this.getAllVideos("month")
    this.setFilter();
  }

  getByYear(){
    this.getAllVideos("year")
    this.setFilter();
  }

  getByWeek(){
    this.getAllVideos("week")
    this.setFilter();
  }

}

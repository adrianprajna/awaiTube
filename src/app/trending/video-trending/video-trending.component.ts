import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-video-trending',
  templateUrl: './video-trending.component.html',
  styleUrls: ['./video-trending.component.scss']
})
export class VideoTrendingComponent implements OnInit {

  @Input() video: any;
  user: User;
  settings: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(this.video.user_id).valueChanges
      .subscribe(result => {
        this.user = result.data.getUser;
      })
  }

  addSettings(){
    this.settings = !this.settings;
  }

  getUploadedDate(): string{
    let today = new Date();
    let date: number;
    
    if(today.getFullYear() > this.video.year){
      return today.getFullYear() - this.video.year == 1 ? (today.getFullYear() - this.video.year).toString() + " year ago" : (today.getFullYear() - this.video.year).toString() + " years ago"
    }

    if(today.getMonth() + 1 > this.video.month){
      return (today.getMonth() - this.video.month + 1) == 1 ? (today.getMonth() - this.video.month + 1).toString() + " month ago" : (today.getMonth() - this.video.month + 1).toString() + " months ago"
    }

    if(today.getDate() > this.video.day){
      return (today.getDate() - this.video.day) == 1 ? (today.getDate() - this.video.day).toString() + " days ago" : (today.getDate() - this.video.day).toString() + " days ago"
    }

    let video_time: any = JSON.parse(this.video.time)
   

    if(today.getHours() > video_time.hour){
      return (today.getHours() - video_time.hour) == 1 ? (today.getHours() - video_time.hour).toString() + " hour ago" : (today.getHours() - video_time.hour).toString() + " hours ago"
    }

    if(today.getMinutes() > video_time.minute){
      return (today.getMinutes() - video_time.minute) == 1 ? (today.getMinutes() - video_time.minute).toString() + " minute ago" : (today.getMinutes() - video_time.minute).toString() + " minutes ago"
    }

    if(today.getSeconds() > video_time.second){
      return (today.getSeconds() - video_time.second).toString() + " seconds ago"
    }
  }

}

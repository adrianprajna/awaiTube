import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-entertainment-category',
  templateUrl: './entertainment-category.component.html',
  styleUrls: ['./entertainment-category.component.scss']
})
export class EntertainmentCategoryComponent implements OnInit {

  videos: Array<any>;

  recentlyVideos: Array<any> = new Array
  popularWeekVideos: Array<any> = new Array
  popularMonthVideos: Array<any> = new Array
  popularAllTime: Array<any> = new Array
  date = new Date()

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos()
      .valueChanges
      .subscribe((result) => {
          this.videos = result.data.videos;
          this.videos = this.videos.filter((video: any) => video.category == "Entertainment");
          this.getRecentlyVideos()
          this.getPopularThisWeek()      
          this.getPopularMonth()
          this.getPopularAllTime()
      });
  }

  getRecentlyVideos(){
    this.recentlyVideos = [...this.videos]
    this.recentlyVideos = this.recentlyVideos.sort((a: any, b: any) => b.views - a.views);
    this.recentlyVideos = this.recentlyVideos.filter((video: any) => video.day == this.date.getDate() && video.year == this.date.getFullYear() && video.month == this.date.getMonth() + 1);
  }

  getPopularThisWeek(){
    this.popularWeekVideos = [...this.videos]
    this.popularWeekVideos = this.popularWeekVideos.sort((a: any, b: any) => b.views - a.views);
    this.popularWeekVideos = this.popularWeekVideos.filter((video: any) => video.month == this.date.getMonth() + 1 && video.year == this.date.getFullYear())
    this.popularWeekVideos = this.popularWeekVideos.filter((video: any) => video.day > this.date.getDate() - 7 && video.day < this.date.getDate())
  }

  getPopularMonth(){
    for(let i = 0; i < this.videos.length; i++){
      if(!this.popularWeekVideos.includes(this.videos[i])){
        this.popularMonthVideos.push(this.videos[i])
      }
    }
    this.popularMonthVideos = this.popularMonthVideos.sort((a: any, b: any) => b.views - a.views);
    this.popularMonthVideos = this.popularMonthVideos.filter((video: any) => (video.month == this.date.getMonth() + 1 || video.month == this.date.getMonth()) && video.year == this.date.getFullYear())
  }

  getPopularAllTime(){
    for(let i = 0; i < this.videos.length; i++){
      if(!this.popularMonthVideos.includes(this.videos[i])){
        this.popularAllTime.push(this.videos[i])
      }
    }
    this.popularAllTime = this.popularAllTime.sort((a: any, b: any) => b.views - a.views);
  }

}

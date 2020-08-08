import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-channel-playlist',
  templateUrl: './channel-playlist.component.html',
  styleUrls: ['./channel-playlist.component.scss']
})
export class ChannelPlaylistComponent implements OnInit {

  @Input() playlist: any

  topVideo: any

  videos: Array<any>

  hover: boolean = false;

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    console.log(this.playlist);    
    this.videos = JSON.parse(this.playlist.videos)
    console.log(this.videos[0].id);    
    this.videoService.getVideo(this.videos[0].id).valueChanges
      .subscribe(result => this.topVideo = result.data.getVideo)
  }

  addHover(): void {
    this.hover = !this.hover;
  }

}

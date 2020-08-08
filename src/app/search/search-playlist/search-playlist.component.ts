import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { User } from 'src/app/type';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-playlist',
  templateUrl: './search-playlist.component.html',
  styleUrls: ['./search-playlist.component.scss']
})
export class SearchPlaylistComponent implements OnInit {

  @Input() playlist: any

  video: any

  user: User

  constructor(private videoService: VideoService, private userService: UserService) { }

  ngOnInit(): void {
    let playlist_json = JSON.parse(this.playlist.videos)
    this.videoService.getVideo(playlist_json[0].id).valueChanges
      .subscribe(result => this.video = result.data.getVideo)

    this.userService.getUser(this.playlist.user_id).valueChanges
      .subscribe(result => this.user = result.data.getUser)
  }

}

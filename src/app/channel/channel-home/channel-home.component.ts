import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  ChannelService
} from 'src/app/services/channel.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  User
} from 'src/app/type';
import {
  VideoService
} from 'src/app/services/video.service';
import {
  PlaylistService
} from 'src/app/playlist.service';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private channelService: ChannelService, private userService: UserService, private videoService: VideoService, private playlistService: PlaylistService) {}

  id: number
  channel: any;
  videos: any;
  user: User;
  playlist: Array < any >

    randomVideos: Array < any >

    ngOnInit(): void {

      this.activatedRoute.paramMap.subscribe(params => {
        this.id = parseInt(params.get('id'));
        this.getChannel();
      })

    }

  getChannel() {
    this.channelService.getChannel(this.id).valueChanges
      .subscribe(result => {
        this.channel = result.data.channel;
        this.getUser();
      })
  }

  getUser() {
    this.userService.getUser(this.channel.user_id).valueChanges
      .subscribe(res => {
        this.user = res.data.getUser;
        this.getAllVideos();
        this.getAllPlaylist()
      });
  }

  getAllVideos() {
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        this.videos = result.data.videos;
        this.randomVideos = [...this.videos];
        this.videos = Array.from(this.videos).filter((video: any) => video.user_id == this.user.id)
        this.videos = Array.from(this.videos).sort((a: any, b: any) => b.id - a.id);

        this.randomVideos = Array.from(this.randomVideos).filter((video: any) => video.user_id == this.user.id)
        this.randomVideos = this.shuffle(this.randomVideos);
      })
  }

  getAllPlaylist() {
    this.playlistService.getAllUserPlaylist(this.user.id as any).valueChanges
      .subscribe(result => {
        this.playlist = result.data.getAllUserPlaylist
        this.playlist = this.playlist.filter((list: any) => list.privacy == "Public");
        this.playlist = this.shuffle(this.playlist)
      })
  }

  navigate(link: string) {
    window.location.href = `/channel/${this.id}/${link}`
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

}

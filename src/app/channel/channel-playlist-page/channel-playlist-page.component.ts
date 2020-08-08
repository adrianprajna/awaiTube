import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/playlist.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel-playlist-page',
  templateUrl: './channel-playlist-page.component.html',
  styleUrls: ['./channel-playlist-page.component.scss']
})
export class ChannelPlaylistPageComponent implements OnInit {

  playlist: Array<any>

  user: User

  channel: any

  id: number
  
  constructor(private playlistService: PlaylistService, private userService: UserService, private channelService: ChannelService, private activatedRoute: ActivatedRoute) { }

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

  getUser(){
    this.userService.getUser(this.channel.user_id).valueChanges
    .subscribe(res => {
      this.user = res.data.getUser;
      this.getAllPlaylist()
    });
  }

  getAllPlaylist(){
    this.playlistService.getAllUserPlaylist(this.user.id as any).valueChanges
      .subscribe(result => {
        this.playlist = result.data.getAllUserPlaylist
        this.playlist = this.playlist.filter((list: any) => list.privacy == "Public");     
      })
  }
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
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

import { Component, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { LoginService } from '../services/login.service';
import { PlaylistService } from '../playlist.service';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { UserService } from '../services/user.service';
import { User } from '../type';
import { ChannelService } from '../services/channel.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  constructor(private playlistService: PlaylistService, private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, private channelService: ChannelService, private apollo: Apollo) { }

  playlist_id: number;
  playlist: any;
  videos: any;

  topVideo: any;
  user: User;
  channel: any;

  sortDropdown: boolean = false;
  inputDropdown: boolean = false;
  descDropdown: boolean = false;
  privacyDropdown: boolean = false;
  isModalDrop: boolean = false;

  public: boolean = false;
  private: boolean = false;

  date = new Date();

  ngOnInit(): void {
      this.route.paramMap.subscribe(paramMap => {
        this.playlist_id = parseInt(paramMap.get('id'))
        this.getPlaylist();
      })
  }

  getPlaylist(){
    this.playlistService.getPlaylist(this.playlist_id).valueChanges
      .subscribe(result => {
        this.playlist = result.data.playlist;
        this.getUser(this.playlist.user_id);  
        this.videos = JSON.parse(this.playlist.videos);  
        this.getTopVideo(this.videos[0]);
        this.checkPrivacy();
      });
  }

  checkPrivacy(): void{
    if(this.playlist.privacy == "Public"){
      this.private = false;
      this.public = true;
    }else if(this.playlist.privacy == "Private"){
      this.private = true;
      this.public = false;
    }
  }

  getTopVideo(video: any){
    this.videoService.getVideo(video.id).valueChanges
      .subscribe(res => this.topVideo = res.data.getVideo);
  }

  getUser(id: number){
      this.userService.getUser(id).valueChanges
        .subscribe(res =>{
          this.user = res.data.getUser
          this.getChannel(this.user.id as any)
        });
  }

  getChannel(user_id: number){
    this.channelService.getChannelByUser(user_id).valueChanges
      .subscribe(result => this.channel = result.data.getChannelByUser)
  }

  getDate(): string {
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${month[this.playlist.month - 1]} ${this.playlist.day}, ${this.playlist.year}`
  }

  addSort(): void{
    this.sortDropdown = !this.sortDropdown;
  }

  addInputDropdown(): void {
    this.inputDropdown = !this.inputDropdown;
  }

  addDescDropdown(): void {
    this.descDropdown = !this.descDropdown;
  }

  addPrivacyDropdown(): void {
    this.privacyDropdown = !this.privacyDropdown;
  }

  editTitle(): void {
    let title = document.getElementById('input-title') as HTMLInputElement;
    

    this.apollo.mutate({
      mutation: this.playlistService.updateQuery,
      variables: {
        id: this.playlist_id,
        user_id: this.playlist.user_id,
        name: title.value,
        privacy: this.playlist.privacy,
        description: this.playlist.description,
        views: this.playlist.views,
        day: this.date.getDate(),
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear(),
        videos: this.playlist.videos
      },
      refetchQueries: [{
        query: gql `
          query getPlaylist($id: ID!){
            playlist(id: $id){
              user_id
              name
              privacy
              description
              views
              day
              month
              year
              videos
            }
          }
        `,
        variables: {
          id: this.playlist_id
        }
      }]
    }).subscribe()
    
    title.value = "";
    this.addInputDropdown();
  }

  editDesc(): void{
    let desc = document.getElementById('input-desc') as HTMLInputElement
    

    this.apollo.mutate({
      mutation: this.playlistService.updateQuery,
      variables: {
        id: this.playlist_id,
        user_id: this.playlist.user_id,
        name: this.playlist.name,
        privacy: this.playlist.privacy,
        description: desc.value,
        views: this.playlist.views,
        day: this.date.getDate(),
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear(),
        videos: this.playlist.videos
      },
      refetchQueries: [{
        query: gql `
          query getPlaylist($id: ID!){
            playlist(id: $id){
              user_id
              name
              privacy
              description
              views
              day
              month
              year
              videos
            }
          }
        `,
        variables: {
          id: this.playlist_id
        }
      }]
    }).subscribe()
    
    desc.value = "";
    this.addDescDropdown();
  }

  editPrivacy(privacy: string): void {
    this.apollo.mutate({
      mutation: this.playlistService.updateQuery,
      variables: {
        id: this.playlist_id,
        user_id: this.playlist.user_id,
        name: this.playlist.name,
        privacy: privacy,
        description: this.playlist.description,
        views: this.playlist.views,
        day: this.date.getDate(),
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear(),
        videos: this.playlist.videos
      },
      refetchQueries: [{
        query: gql `
          query getPlaylist($id: ID!){
            playlist(id: $id){
              user_id
              name
              privacy
              description
              views
              day
              month
              year
              videos
            }
          }
      `,
      variables: {
        id: this.playlist_id
      }
      }]
    }).subscribe(res => this.addPrivacyDropdown());
  }

  removeAll(): void {
    this.playlistService.deletePlaylist(this.playlist_id)
  }

  addModalDrop(): void {
    this.isModalDrop = !this.isModalDrop;
  }

  shufflePlay(): void {   
    let array: Array<number> = new Array;
    Array.from(this.videos).forEach((vid: any) => {
      array.push(vid.id)
    })

    let min = Math.min(...array)
    let max = Math.max(...array)
    let valid: boolean = false;
    let random: number = 0;
    
    while(!valid){
      random = this.rand(min, max);
      array.forEach(num => {
        if(num == random){
          valid = true;
        }
      })
    }
  }

  rand(min: number, max: number) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.floor(randomNum);
  }

}

import {
  Component,
  OnInit
} from '@angular/core';
import {
  SocialUser
} from 'angularx-social-login';
import {
  LoginService
} from '../services/login.service';
import {
  PlaylistService
} from '../playlist.service';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  VideoService
} from '../services/video.service';
import {
  UserService
} from '../services/user.service';
import {
  User,
  Obj
} from '../type';
import {
  ChannelService
} from '../services/channel.service';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  constructor(private playlistService: PlaylistService, private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, private channelService: ChannelService, private apollo: Apollo, private loginService: LoginService, private router: Router) {}

  playlist_id: number;
  playlist: any;
  videos: Array<any>;

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

  loginUser: SocialUser


  date = new Date();
  observer: IntersectionObserver
  isOwned: boolean = false
  isSelf: boolean = false;

  displayedVideos: number = 4

  isPop: boolean = false;
  popString: string = "";
  userByEmail: User

  ngOnInit(): void {

    if (localStorage.getItem('users') != null) {
      this.loginService.getUserFromStorage()
      this.loginUser = this.loginService.user
    }

    this.route.paramMap.subscribe(paramMap => {
      this.playlist_id = parseInt(paramMap.get('id'))
      this.getPlaylist();
    })

    this.observer = new IntersectionObserver(entry => {
      if (entry[0].isIntersecting) {
        console.log(entry[0])
        for (let i = 0; i < 4; i++) {
          if (this.displayedVideos < this.videos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-playlist-video')
            video.setAttribute('video', 'this.videos[this.displayedVideos]');
            video.setAttribute('userPlaylist', 'this.user');
            video.setAttribute('userByEmail', 'this.userByEmail')
            video.setAttribute('playlist', 'this.playlist');
            div.appendChild(video);
            let row = document.querySelector('.row');
            row.appendChild(div);
            this.displayedVideos++;
            console.log(row);
          }
        }
      }
    })

    let footer = document.getElementById('footer');
    this.observer.observe(footer)
  }


  getPlaylist() {
    this.playlistService.getPlaylist(this.playlist_id).valueChanges
      .subscribe(result => {
        this.playlist = result.data.playlist;
        this.getUser(this.playlist.user_id);
        this.videos = JSON.parse(this.playlist.videos);
        this.getTopVideo(this.videos[0]);
        this.checkPrivacy();
      });
  }

  checkPlaylist() {
    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(res => {
        this.userByEmail = res.data.getUserByEmail
        if(this.userByEmail.id == this.user.id) 
          this.isSelf = true;
        let playlist_user: Array < Obj > = JSON.parse(this.userByEmail.playlists)
        playlist_user.forEach((p: any) => {
          if (p.id == this.playlist_id) {
            this.isOwned = true;
          }       
        })
      })
  }

  checkPrivacy(): void {
    if (this.playlist.privacy == "Public") {
      this.private = false;
      this.public = true;
    } else if (this.playlist.privacy == "Private") {
      this.private = true;
      this.public = false;
    }
  }

  getTopVideo(video: any) {
    this.videoService.getVideo(video.id).valueChanges
      .subscribe(res => this.topVideo = res.data.getVideo);
  }

  getUser(id: number) {
    this.userService.getUser(id).valueChanges
      .subscribe(res => {
        this.user = res.data.getUser
        this.checkPlaylist()
        this.getChannel(this.user.id as any)
      });
  }

  getChannel(user_id: number) {
    this.channelService.getChannelByUser(user_id).valueChanges
      .subscribe(result => this.channel = result.data.getChannelByUser)
  }

  getDate(): string {
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${month[this.playlist.month - 1]} ${this.playlist.day}, ${this.playlist.year}`
  }

  addSort(): void {
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
    }).subscribe(res => {
      this.popString = "Successfully update the title!"
      this.isPop = true;
      setTimeout(() => {
        this.isPop = false;
      }, 2000);
    })

    title.value = "";
    this.addInputDropdown();
  }

  editDesc(): void {
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
    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(res => {

        let playlists_user: Array < Obj > = JSON.parse(res.data.getUserByEmail.playlists)
        playlists_user.forEach((p: Obj, index) => {
          if (p.id == this.playlist_id) {
            playlists_user.splice(index, 1)
          }
        })

        this.apollo.mutate({
          mutation: this.userService.updateUserQuery,
          variables: {
            id: res.data.getUserByEmail.id,
            name: res.data.getUserByEmail.id.name,
            email: res.data.getUserByEmail.id.email,
            img_url: res.data.getUserByEmail.id.img_url,
            premium: res.data.getUserByEmail.id.premium,
            subscribers: res.data.getUserByEmail.idl.subscribers,
            liked_video: res.data.getUserByEmail.liked_video,
            disliked_video: res.data.getUserByEmail.disliked_video,
            liked_comment: res.data.getUserByEmail.liked_comment,
            disliked_comment: res.data.getUserByEmail.disliked_comment,
            subscribed_channel: res.data.getUserByEmail.subscribed_channel,
            playlists: JSON.stringify(playlists_user),
            liked_post: res.data.getUserByEmail.liked_post,
            disliked_post: res.data.getUserByEmail.disliked_post
          }
        }).subscribe()

      })

  }

  addModalDrop(): void {
    this.isModalDrop = !this.isModalDrop;
  }

  shufflePlay(): void {
    let random = this.rand(0, this.videos.length);
    let id = this.videos[random].id;
    this.router.navigate([`/video-detail/${id}`], {queryParams: {playlist: this.playlist_id}})
  }

  rand(min: number, max: number) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.floor(randomNum);
  }

  saveToPlaylist(): void {
    let playlists: Array<any> = JSON.parse(this.userByEmail.playlists);

   let id: Obj = {
     id: this.playlist_id
   }

   playlists.push(id);

   this.apollo.mutate({
     mutation: this.userService.updateUserQuery,
     variables: {
      id: this.userByEmail.id,
      name: this.userByEmail.name,
      email: this.userByEmail.email,
      img_url: this.userByEmail.img_url,
      premium: this.userByEmail.premium,
      subscribers: this.userByEmail.subscribers,
      liked_video: this.userByEmail.liked_video,
      disliked_video: this.userByEmail.disliked_video,
      liked_comment: this.userByEmail.liked_comment,
      disliked_comment: this.userByEmail.disliked_comment,
      subscribed_channel: this.userByEmail.subscribed_channel,
      playlists: JSON.stringify(playlists),
      liked_post: this.userByEmail.liked_post,
      disliked_post: this.userByEmail.disliked_post
     },
     refetchQueries: [{
       query: this.userService.getUserByEmailQuery,
       variables: {
         email: this.userByEmail.email
       }
     }]
   }).subscribe(result => {
     this.popString = "Successfully save this playlist!";
     this.isPop = true;
     setTimeout(() => {
       this.isPop = false;
     }, 3000);
   })

  }

  removeFromPlaylist(){
    let playlists: Array<any> = JSON.parse(this.userByEmail.playlists);

    playlists.forEach((p: any, index) => {
      if(p.id == this.playlist_id){
        playlists.splice(index, 1);
      }
    })

    this.apollo.mutate({
      mutation: this.userService.updateUserQuery,
      variables: {
       id: this.userByEmail.id,
       name: this.userByEmail.name,
       email: this.userByEmail.email,
       img_url: this.userByEmail.img_url,
       premium: this.userByEmail.premium,
       subscribers: this.userByEmail.subscribers,
       liked_video: this.userByEmail.liked_video,
       disliked_video: this.userByEmail.disliked_video,
       liked_comment: this.userByEmail.liked_comment,
       disliked_comment: this.userByEmail.disliked_comment,
       subscribed_channel: this.userByEmail.subscribed_channel,
       playlists: JSON.stringify(playlists),
       liked_post: this.userByEmail.liked_post,
       disliked_post: this.userByEmail.disliked_post
      },
      refetchQueries: [{
        query: this.userService.getUserByEmailQuery,
        variables: {
          email: this.userByEmail.email
        }
      }]
    }).subscribe(result => {
      this.popString = "Successfully remove this playlist from yours!"
      this.isPop = true;
      setTimeout(() => {
        this.isPop = false;
      }, 3000);
    })
  }

}

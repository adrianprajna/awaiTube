import { Component, OnInit, Input } from '@angular/core';
import { User, Obj } from 'src/app/type';
import { VideoService } from 'src/app/services/video.service';
import { ChannelService } from 'src/app/services/channel.service';
import { LoginService } from 'src/app/services/login.service';
import { SocialUser } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-search-channel',
  templateUrl: './search-channel.component.html',
  styleUrls: ['./search-channel.component.scss']
})
export class SearchChannelComponent implements OnInit {

  @Input() user: User

  videos: Array<any>

  channel: any

  self: boolean = false;
  subscriber: boolean = false;

  loginUser: SocialUser

  userRightNow: User;

  constructor(private videoService: VideoService, private channelService: ChannelService, private loginService: LoginService, private userService: UserService, private apollo: Apollo) { }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage()
      this.loginUser = this.loginService.user
    }

    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        this.videos = result.data.videos
        this.videos = this.videos.filter((vid:any) => vid.user_id == this.user.id)
      })

    this.channelService.getChannelByUser(this.user.id as any).valueChanges
      .subscribe(result => {
        this.channel = result.data.getChannelByUser
        this.getUserByEmail()
      })
  }

  getUserByEmail(){
    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(result =>{
        this.userRightNow = result.data.getUserByEmail
        if(this.userRightNow.id == this.user.id){
          this.self = true;
        }

        let subscribed_channels: Array<Obj> = JSON.parse(this.userRightNow.subscribed_channel)
        subscribed_channels.forEach((chan: any) => {
          if(chan.id == this.channel.id){
            this.subscriber = true;
          }
        })
      })
  }

  subscribeChannel() {

    if (this.loginUser == null) {
      alert('you have to sign in first before subscribe channel!');
      return;
    }

    let subscribed_channel: Array < Obj > = JSON.parse(this.userRightNow.subscribed_channel);
    let object: Obj;

    object = {
      id: this.channel.id as any
    }

    subscribed_channel.push(object);

    this.apollo.mutate({
      mutation: this.userService.updateUserQuery,
      variables: {
        id: this.userRightNow.id,
        name: this.userRightNow.name,
        email: this.userRightNow.email,
        img_url: this.userRightNow.img_url,
        premium: this.userRightNow.premium,
        subscribers: this.userRightNow.subscribers,
        liked_video: this.userRightNow.liked_video,
        disliked_video: this.userRightNow.disliked_video,
        liked_comment: this.userRightNow.liked_comment,
        disliked_comment: this.userRightNow.disliked_comment,
        subscribed_channel: JSON.stringify(subscribed_channel),
        playlists: this.userRightNow.playlists,
        liked_post: this.userRightNow.liked_post,
        disliked_post: this.userRightNow.disliked_post
      },
      refetchQueries: [{
        query: this.userService.getUserByEmailQuery,
        variables: {
          email: this.loginUser.email
        }
      }]
    }).subscribe(res => {
      this.increaseSubscriber(1);
      alert('successfuly subscribe this channel!')
    });
  }

  unsubscribeChannel() {

    let subscribed_channel: Array < Obj > = JSON.parse(this.userRightNow.subscribed_channel);

    subscribed_channel.forEach((channel, index) => {
      if (channel.id == this.channel.id) {
        subscribed_channel.splice(index, 1);
      }
    })

    this.apollo.mutate({
      mutation: this.userService.updateUserQuery,
      variables: {
        id: this.userRightNow.id,
        name: this.userRightNow.name,
        email: this.userRightNow.email,
        img_url: this.userRightNow.img_url,
        premium: this.userRightNow.premium,
        subscribers: this.userRightNow.subscribers,
        liked_video: this.userRightNow.liked_video,
        disliked_video: this.userRightNow.disliked_video,
        liked_comment: this.userRightNow.liked_comment,
        disliked_comment: this.userRightNow.disliked_comment,
        subscribed_channel: JSON.stringify(subscribed_channel),
        playlists: this.userRightNow.playlists,
        liked_post: this.userRightNow.liked_post,
        disliked_post: this.userRightNow.disliked_post
      },
      refetchQueries: [{
        query: this.userService.getUserByEmailQuery,
        variables: {
          email: this.loginUser.email
        }
      }]
    }).subscribe(res => {
      this.increaseSubscriber(-1);
      alert('unsubscribe this channel successful!')
    });
  }

  increaseSubscriber(subs: number) {
    this.apollo.mutate({
      mutation: this.userService.updateUserQuery,
      variables: {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        img_url: this.user.img_url,
        premium: this.user.premium,
        subscribers: this.user.subscribers + subs,
        liked_video: this.user.liked_video,
        disliked_video: this.user.disliked_video,
        liked_comment: this.user.liked_comment,
        disliked_comment: this.user.disliked_comment,
        subscribed_channel: this.user.subscribed_channel,
        playlists: this.user.playlists,
        liked_post: this.user.liked_post,
        disliked_post: this.user.disliked_post
      }
    }).subscribe(res => console.log(res.data));
  }

}

import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  UserService
} from 'src/app/services/user.service';
import {
  User,
  Obj
} from 'src/app/type';
import {
  ActivatedRoute
} from '@angular/router';
import {
  ChannelService
} from 'src/app/services/channel.service';
import {
  SocialUser
} from 'angularx-social-login';
import {
  LoginService
} from 'src/app/services/login.service';
import {
  Apollo
} from 'apollo-angular';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss']
})
export class ChannelHeaderComponent implements OnInit {

  user: User;
  loginUser: SocialUser

  channel: any

  id: number

  isSubscribed: boolean = false;

  userByEmail: User

  constructor(private activatedRoute: ActivatedRoute, private channelService: ChannelService, private userService: UserService, private loginService: LoginService, private apollo: Apollo) {}

  ngOnInit(): void {

    if (localStorage.getItem('users') != null) {
      this.loginService.getUserFromStorage()
      this.loginUser = this.loginService.user;
      this.checkSubscribe();
    }

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));


      this.channelService.getChannel(this.id).valueChanges
        .subscribe(result => {
          this.channel = result.data.channel;

          this.userService.getUser(this.channel.user_id).valueChanges
            .subscribe(res => {
              this.user = res.data.getUser
            });
        })
    })

  }

  navigate(link: string) {
    window.location.href = `/channel/${this.id}/${link}`
  }

  checkSubscribe() {
    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(res => {
        this.userByEmail = res.data.getUserByEmail
        let subscribed_channel: Array < Obj > = JSON.parse(res.data.getUserByEmail.subscribed_channel)
        subscribed_channel.forEach(channel => {
          if (channel.id == this.id) {
            this.isSubscribed = true;
          }
        })
      })
  }

  subscribeChannel() {

    if (this.loginUser == null) {
      alert('you have to sign in first before subscribe channel!');
      return;
    }

    let subscribed_channel: Array < Obj > = JSON.parse(this.userByEmail.subscribed_channel);
    let object: Obj;

    object = {
      id: this.id
    }

    subscribed_channel.push(object);

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
        subscribed_channel: JSON.stringify(subscribed_channel),
        playlists: this.userByEmail.playlists,
        liked_post: this.userByEmail.liked_post,
        disliked_post: this.userByEmail.disliked_post
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

    let subscribed_channel: Array < Obj > = JSON.parse(this.userByEmail.subscribed_channel);

    subscribed_channel.forEach((channel, index) => {
      if (channel.id == this.id) {
        console.log("wkwk");
        this.isSubscribed = false;
        subscribed_channel.splice(index, 1);
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
        subscribed_channel: JSON.stringify(subscribed_channel),
        playlists: this.userByEmail.playlists,
        liked_post: this.userByEmail.liked_post,
        disliked_post: this.userByEmail.disliked_post
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

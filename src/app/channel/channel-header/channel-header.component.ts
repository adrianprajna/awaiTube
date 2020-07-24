import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, Obj } from 'src/app/type';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { SocialUser } from 'angularx-social-login';
import { LoginService } from 'src/app/services/login.service';

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

  constructor(private activatedRoute: ActivatedRoute, private channelService: ChannelService, private userService: UserService, private loginService: LoginService) { }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
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

  navigate(link: string){
    window.location.href = `/channel/${this.id}/${link}`
  }

  checkSubscribe() {
    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(res => {
          let subscribed_channel: Array < Obj > = JSON.parse(res.data.getUserByEmail.subscribed_channel)
          subscribed_channel.forEach(channel => {
            if (channel.id == this.id) {
              this.isSubscribed = true;
            }
          })
      })
  }


}

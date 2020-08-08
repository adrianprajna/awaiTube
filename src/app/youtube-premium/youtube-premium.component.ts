import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { SocialUser } from 'angularx-social-login';
import { User } from '../type';
import { join } from 'path';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-youtube-premium',
  templateUrl: './youtube-premium.component.html',
  styleUrls: ['./youtube-premium.component.scss']
})
export class YoutubePremiumComponent implements OnInit {

  isPremium: boolean = false

  loginUser: SocialUser
  
  isPop: boolean = false;
  expirationDate: String
  membership: any
  user: User
  date = new Date()
  
   month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private loginService: LoginService, private userService: UserService, private apollo: Apollo) { }

  ngOnInit(): void {
    this.isPop = false
    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage()
      this.loginUser = this.loginService.user

      this.userService.getUserByEmail(this.loginUser.email).valueChanges
        .subscribe(result => {  
            this.user = result.data.getUserByEmail;
            console.log(this.user.premium);            
            if(this.user.premium == true){
              this.isPremium = true;
              this.getMembership()
            }
        })
    }
  }

  getMembership(){
    this.userService.getMembership(this.user.id as any).valueChanges
    .subscribe(result =>{
      this.membership = result.data.membership
      if(this.membership.plan == "Monthly"){
        this.expirationDate = `${this.month[this.date.getMonth() + 1]} ${this.date.getDate()}, ${this.date.getFullYear()}`
      } else {
        this.expirationDate = `${this.month[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear() + 1}`
      }
    })
  }

  createMembership(): void {
    let plan = "Monthly";
    let plans = document.getElementsByName('plan')

    plans.forEach(p => {
      if((p as HTMLInputElement).checked && (p as HTMLInputElement).value == "Anually") {
        plan = "Anually";
      }
    })

    let join_date = `${this.month[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear()}`

    this.userService.createMembership(this.user.id as any, plan, join_date)
      .subscribe(result => {
          this.apollo.mutate({
            mutation: this.userService.updateUserQuery,
            variables: {
              id: this.user.id,
              name: this.user.name,
              email: this.user.email,
              img_url: this.user.img_url,
              premium: true,
              subscribers: this.user.subscribers,
              liked_video: this.user.liked_video,
              disliked_video: this.user.disliked_video,
              liked_comment: this.user.liked_comment,
              disliked_comment: this.user.disliked_comment,
              subscribed_channel: this.user.subscribed_channel,
              playlists: this.user.playlists,
              liked_post: this.user.liked_post,
              disliked_post: this.user.disliked_post
            },
            refetchQueries: [{
              query: this.userService.getUserByEmailQuery,
              variables: {
                email: this.loginUser.email
              }
            }]
          }).subscribe(result => {
            this.isPop = true
            setTimeout(() => {
              this.isPop = false;
            }, 3000);
          })

      })
  }

}

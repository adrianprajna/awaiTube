import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { User, Obj } from '../type';
import { VideoService } from '../services/video.service';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {


  loggedIn: Boolean;
  loginUser: SocialUser;
  userByEmail: User;
  isConcat = false;
  date = new Date()


  today_videos: Array<any>;
  week_videos: Array<any>;
  month_videos: Array<any>;

  columns: number = 4;
  observer: IntersectionObserver;
  displayedVideos: number = 4;
  constructor(private loginService: LoginService, private authService: SocialAuthService, private videoService: VideoService, private userService: UserService, private channelService: ChannelService) { }

  ngOnInit(): void {
    
    this.loginService.currentLoggedIn.subscribe(login => this.loggedIn = login);

    if(localStorage.getItem('users') != null){
        this.loginService.getUserFromStorage();
        this.loginUser = this.loginService.user;
        this.getUserByEmail();    
    }

   
    this.observer = new IntersectionObserver(entry => { 
      if(entry[0].isIntersecting){
        console.log(entry[0]);        
        for(let i = 0; i < this.columns; i++){
          if(this.displayedVideos < this.month_videos.length){
            let div = document.createElement('div');
            let video = document.createElement('app-video')
            video.setAttribute('video', 'this.month_videos[this.displayedVideos]');
            div.appendChild(video);
            let row = document.querySelector('.month');
            row.appendChild(div);
            this.displayedVideos++;
          }
        }
      }
    })

    let footer = document.getElementById('footer');
    this.observer.observe(footer)  
  }

  signIn(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe((user) => {
        this.loginService.addToLocalStorage(user);
    
        this.loginService.newUser.next(user);
        this.loginService.userObservable.next(true);

        window.location.reload();
    });

  }

  getUserByEmail() {
    this.userService.getUserByEmail(this.loginUser.email)
      .valueChanges
      .subscribe(result => {
        this.userByEmail = result.data.getUserByEmail;
        
        let subscribed_channel: Array<Obj> = JSON.parse(this.userByEmail.subscribed_channel);

        subscribed_channel.forEach(channel => { 
            this.channelService.getChannel(channel.id).valueChanges
              .subscribe( (result) => {
                let chan =  result.data.channel;
                this.getTodayVideos(chan);      
                this.getWeekVideos(chan);    
                this.getMonthVideos(chan);       
              })
        })

      });
  }

  getTodayVideos(chan: any){
    this.videoService.getAllVideos().valueChanges
    .subscribe( (res) => {
      let videos =  res.data.videos;
      
      videos = Array.from(videos).filter((vid: any) => vid.year == this.date.getFullYear());
      videos = Array.from(videos).filter((vid: any) => vid.month == this.date.getMonth() + 1);
      videos = Array.from(videos).filter((vid: any) => vid.user_id == chan.user_id && vid.day == this.date.getDate());  
      videos = Array.from(videos).sort((a: Obj, b: Obj) => b.id - a.id);
      
      if(!this.today_videos){                   
        this.today_videos = videos;
      } else {
        this.today_videos = this.today_videos.concat(videos);
      }         
    })
  }

  getWeekVideos(chan: any){
    this.videoService.getAllVideos().valueChanges
    .subscribe( (res) => {
      let videos =  res.data.videos;
      videos = Array.from(videos).sort((a: Obj, b: Obj) => b.id - a.id);
      videos = Array.from(videos).filter((vid: any) => vid.year == this.date.getFullYear());
      videos = Array.from(videos).filter((vid: any) => vid.month == this.date.getMonth() + 1);
      videos = Array.from(videos).filter((vid: any) => vid.user_id == chan.user_id && vid.day > this.date.getDate() - 7);
                      
      if(!this.week_videos){                   
        this.week_videos = videos;
      } else {
        this.week_videos = this.week_videos.concat(videos);
      }                          
    })
  }

  getMonthVideos(chan: any){
    this.videoService.getAllVideos().valueChanges
    .subscribe( (res) => {
      let videos =  res.data.videos;
      videos = Array.from(videos).sort((a: Obj, b: Obj) => b.id - a.id);
      videos = Array.from(videos).filter((vid: any) => vid.year == this.date.getFullYear());
      videos = Array.from(videos).filter((vid: any) => vid.month == this.date.getMonth() + 1 || vid.month == this.date.getMonth());
      videos = Array.from(videos).filter((vid: any) => vid.user_id == chan.user_id);
                      
      if(!this.month_videos){                   
        this.month_videos = videos;
      } else {
        this.month_videos = this.month_videos.concat(videos);
      }                          
    })
  }

}

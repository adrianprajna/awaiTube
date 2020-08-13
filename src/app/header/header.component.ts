import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login'
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { User } from '../type';
import { ChannelService } from '../services/channel.service';
import { VideoService } from '../services/video.service';
import { PlaylistService } from '../playlist.service';
import { Observable, timer } from 'rxjs';
import {} from 'rxjs/add/observable/interval'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  active: Boolean = false;

  user: SocialUser;
  userByEmail: User
  loggedIn: Boolean = false;
  isUserDrop: boolean = false;
  isSettingsDrop: boolean = false;
  isLocationDrop: boolean = false;
  isUserLocationDrop: boolean = false;
  isModalDrop: boolean = false;
  isAutoComplete: boolean = false;
  isLoginDrop: boolean = false;
  users = [];

  notifications: Array<any>

  videos_name: Array<any>;
  playlists_name: Array<any>;
  channels_name: Array<any>

  isNotif: boolean = false;
  focus:boolean = true;
  channel_id: number;

  notif: boolean = false;

  constructor(private route: Router, private authService: SocialAuthService, private loginService: LoginService, private channelService: ChannelService, private userService: UserService, private playlistService: PlaylistService, private videoService: VideoService) { }

  ngOnInit(): void {

      if(localStorage.getItem('users') == null){
        this.loginService.users = [];
      }        
      else{
        this.loginService.getUserFromStorage();
        this.user = this.loginService.user;
        this.getUserByEmail();
        this.loggedIn = this.loginService.loggedIn;
        this.userService.getUserByEmail(this.user.email).valueChanges
          .subscribe(result => {
            this.channelService.getChannelByUser(result.data.getUserByEmail.id).valueChanges
              .subscribe(res => this.channel_id = res.data.getChannelByUser.id);
          })
      }
      
      this.observeActive();
  }
  

  signIn(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);

        this.loginService.addToLocalStorage(user);
      
        this.loginService.newUser.next(this.user);
        this.loginService.userObservable.next(this.loggedIn);
    });
  }

  getUserByEmail(){
    this.userService.getUserByEmail(this.user.email).valueChanges
      .subscribe(result => {
        this.userByEmail = result.data.getUserByEmail
        this.getAllNotifications()
      })
  }

  signOut(): void {
    this.loginService.signOut();
    this.loginService.currentUser.subscribe(user => this.user = user);
    this.loginService.currentLoggedIn.subscribe(login => this.loggedIn = login);
  }

  onClick(){
    this.loginService.changeActive(!this.active);
  }

  navigate(link: string){
    this.route.navigate([link]);
    this.addUserDropdown();
  }

  switchRestriction(){
    let p = document.querySelector('#restrict');
    if(p.textContent == "Off"){
      p.textContent = "On";
    } else
      p.textContent = "Off";
  }

  addLoginDrop(){
    this.isLoginDrop = !this.isLoginDrop;
  }
  
  addUserDropdown(){
    this.isUserDrop = !this.isUserDrop;
  }

  addSettingsDropdown(){
    this.isSettingsDrop = !this.isSettingsDrop;
  }

  addLocationDropdown(){
    this.isLocationDrop = !this.isLocationDrop;
  }

  addLocationUserDropdown(){
    this.isUserLocationDrop = !this.isUserLocationDrop;
  }

  addNotifDropdown(){
    this.isNotif = !this.isNotif;
  }

  addModal(){
    this.isModalDrop = true;
  }

  observeActive(){
    this.loginService.currentActive.subscribe(active => {
      this.active = active;
      if(this.active){
        document.getElementById('hidden').style.display = 'block'
      } else if(!this.active){
        document.getElementById('hidden').style.display = 'none'
      }
    })
  }

  receiveModal($event){
    this.isModalDrop = $event;
  }

  onKeyUp(event){
    let input = (document.getElementById('search') as HTMLInputElement).value;
    this.isAutoComplete = true;
    if(input == ""){
      this.isAutoComplete = false;
    }

    this.videoService.getAllVideosByTitle(`%${input}%`).valueChanges
      .subscribe(res => {
          this.videos_name = res.data.getAllVideosByTitle;
      })

    // this.playlistService.getAllPlaylists(`%${input}%`).valueChanges
    //   .subscribe(res => this.playlists_name = res.data.playlists)
    
    // this.userService.getAllUsers(`%${input}%`).valueChanges
    //   .subscribe(res => this.channels_name = res.data.getAllUsers)

    if(event.keyCode == 13){
      this.routeToSearch(input);
    }
  }

  searchPage(){
    let input = (document.getElementById('search') as HTMLInputElement).value;
    this.route.navigate([`search/${input}`])
  }

  routeToSearch(input: string): void {
    this.route.navigate([`search/${input}`])
    this.isAutoComplete = false;
  }

  filterLocation(location: string, type: boolean){
    if(!type){
      this.addLocationDropdown()
      this.addSettingsDropdown()
    } else {
      this.addLocationUserDropdown();
      this.addUserDropdown();
    }
    this.videoService.locationBehaviour.next(location);
  }

  getAllNotifications(){
    this.channelService.getAllNotifications().valueChanges
      .subscribe(result => {
        this.notifications = result.data.notifications
        this.channelService.getChannelByUser(this.userByEmail.id as any).valueChanges
          .subscribe(result => { 
            this.notif = true;    
            // this.notifications = this.notifications.filter((notif: any) => notif.channel_id != result.data.getChannelByUser.id)         
          })
      })
  }

}

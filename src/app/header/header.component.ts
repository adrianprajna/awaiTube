import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login'
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { User } from '../type';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  active: Boolean = false;

  user: SocialUser;
  loggedIn: Boolean = false;
  isUserDrop: boolean = false;
  isSettingsDrop: boolean = false;
  isLocationDrop: boolean = false;
  isModalDrop: boolean = false;
  users = [];

  focus:boolean = true;
  channel_id: number;

  constructor(private route: Router, private authService: SocialAuthService, private loginService: LoginService, private channelService: ChannelService, private userService: UserService) { }

  ngOnInit(): void {

      if(localStorage.getItem('users') == null){
        this.loginService.users = [];
      }        
      else{
        this.loginService.getUserFromStorage();
        this.user = this.loginService.user;
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

  addUserDropdown(){
    this.isUserDrop = !this.isUserDrop;
  }

  addSettingsDropdown(){
    this.isSettingsDrop = !this.isSettingsDrop;
  }

  addLocationDropdown(){
    this.isLocationDrop = !this.isLocationDrop;
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

    if(event.keyCode == 13){
      this.route.navigate([`search/${input}`])
    }
  }

  searchPage(){
    let input = (document.getElementById('search') as HTMLInputElement).value;
    this.route.navigate([`search/${input}`])
  }

}

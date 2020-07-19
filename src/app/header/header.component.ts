import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login'
import { LoginService } from '../services/login.service';

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
  users = [];

  focus:boolean = true;

  constructor(private route: Router, private authService: SocialAuthService, private loginService: LoginService) { }

  ngOnInit(): void {

      if(localStorage.getItem('users') == null){
        this.loginService.users = [];
      }        
      else{
        this.loginService.getUserFromStorage();
        this.user = this.loginService.user;
        this.loggedIn = this.loginService.loggedIn;
      }

      this.observeActive();
  }

  signIn(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);


        console.log(user.name);
        this.loginService.addToLocalStorage(user);

        
        this.loginService.newUser.next(this.user);
        this.loginService.userObservable.next(this.loggedIn);
        window.location.reload();
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

  observeActive(){
    this.loginService.currentActive.subscribe(active => {
      this.active = active;
      if(this.active){
        document.getElementsByTagName('body')[0].style.backgroundColor = 'rgb(0, 0, 0, 0.5)';
      } else if(!this.active){
        document.getElementsByTagName('body')[0].style.backgroundColor = 'snow';
      }

    })
  }

}

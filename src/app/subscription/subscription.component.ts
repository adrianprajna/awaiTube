import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {


  loggedIn: Boolean;

  constructor(private loginService: LoginService, private authService: SocialAuthService) { }

  ngOnInit(): void {
    
   
    this.loginService.currentLoggedIn.subscribe(login => this.loggedIn = login);
  }

  signIn(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe((user) => {
        this.loginService.addToLocalStorage(user);
    
        this.loginService.newUser.next(user);
        this.loginService.userObservable.next(true);
    });

  }

  

}

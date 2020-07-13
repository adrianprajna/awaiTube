import { Injectable } from '@angular/core';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userObservable: BehaviorSubject<Boolean>;
  newUser: BehaviorSubject<SocialUser>;
  activeObservable = new BehaviorSubject<Boolean>(false);

  currentUser: Observable<SocialUser>
  currentLoggedIn: Observable<Boolean>;
  currentActive = this.activeObservable.asObservable();

  users;
  user: SocialUser;
  loggedIn: boolean = false;

  constructor(private authService: SocialAuthService) {
    if(localStorage.getItem('users') == null) {
      this.userObservable = new BehaviorSubject(false);
      this.newUser = new BehaviorSubject(null);

      this.currentUser = this.newUser.asObservable();
      this.currentLoggedIn = this.userObservable.asObservable()
    }
    else {
      this.userObservable = new BehaviorSubject(true);
      this.newUser = new BehaviorSubject(this.user);

      this.currentUser = this.newUser.asObservable();
      this.currentLoggedIn = this.userObservable.asObservable()
    }
  }

  addToLocalStorage(user){
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));

  }

  signOut(): void {
    this.authService.signOut(true);
    this.removeUser();
  }

  getUserFromStorage(){
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users[0];
    this.loggedIn = true;
  }

  removeUser(){
    window.localStorage.clear();
    this.newUser.next(null);
    this.userObservable.next(false);
  }

  changeActive(flag: Boolean){
    this.activeObservable.next(flag);
  }

}

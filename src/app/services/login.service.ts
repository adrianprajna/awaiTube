import { Injectable } from '@angular/core';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs'
import { UserService } from './user.service';
import { User } from '../type';

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

  u;

  constructor(private authService: SocialAuthService, private userService: UserService) {
    if(localStorage.getItem('users') == null) {
      this.userObservable = new BehaviorSubject(false);
      this.newUser = new BehaviorSubject(null);
    }
    else {
      this.userObservable = new BehaviorSubject(true);
      this.newUser = new BehaviorSubject(this.user);
    }

    this.currentUser = this.newUser.asObservable();
    this.currentLoggedIn = this.userObservable.asObservable()
  }

  addToLocalStorage(user: SocialUser){
    //insert into array
    this.users.push(user);
    //add to local storage
    localStorage.setItem('users', JSON.stringify(this.users));

    //insert into db
    this.userService.createUser(user.name, user.email, user.photoUrl);
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
    while(localStorage.getItem('users') != null){
      localStorage.clear();
    }
    window.location.reload();
    this.newUser.next(null);
    this.userObservable.next(false);
  }

  changeActive(flag: Boolean){
    this.activeObservable.next(flag);
  }

}

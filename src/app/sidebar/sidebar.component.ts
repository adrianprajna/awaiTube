import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { SocialUser } from 'angularx-social-login';
import { UserService } from '../services/user.service';
import { Obj } from '../type';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() active: boolean;

  user: SocialUser

  subscribers: Array<Obj>;

  constructor(private route:Router, private loginService: LoginService, private userService: UserService) { 
    
  }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage();
      this.user = this.loginService.user;
      this.getUserByEmail()
    }

    this.addActiveClass();
  }

  addActiveClass(){

    document.addEventListener('DOMContentLoaded', () => {
        let lists = document.querySelectorAll('.list');

        lists.forEach((list) => {
            list.addEventListener('click', function(e){
              // remove all class active
              lists.forEach((list) => {
                list.classList.remove('active');
              })

              console.log(this);
              this.classList.add('active');  
            
            });
        })
      })
    }

  removeActiveClass(){
    document.addEventListener('DOMContentLoaded', function(){
      let lists = document.querySelectorAll('.list');
      console.log(lists);

      lists.forEach((list) => {
        list.classList.remove('active');
      })
    })
  }

  navigate(link: string){
    this.loginService.changeActive(!this.active);
    this.route.navigate([link]);
  }
  
  getUserByEmail(){
    this.userService.getUserByEmail(this.user.email).valueChanges
      .subscribe(res => {
        this.subscribers = JSON.parse(res.data.getUserByEmail.subscribed_channel)
      })
  }


}

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {


  loggedIn: Boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    
   
    this.loginService.currentLoggedIn.subscribe(login => this.loggedIn = login);

  }

  

}

import { Component, OnInit ,Input} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { User } from '../../type'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() video;

  isSettingsDrop: boolean = false;
  isLoggedIn: Boolean;
  length: number;
  
  user: User

  constructor(private loginService: LoginService, private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getUser(this.video.user_id).valueChanges.subscribe(result => {
        this.user = result.data.getUser;
    })

    this.loginService.currentLoggedIn.subscribe(login => this.isLoggedIn = login);
    this.check(); 
  }

  addDropdown(e, id): void{
    if((e.target as HTMLElement).classList.contains('fa-ellipsis-v')){
      let dropdown = document.getElementById(`${id}`);
      // let allDropdown = document.querySelectorAll('.settings-dropdown');

      dropdown.classList.toggle('block');
    }
  }

  check(){
    document.addEventListener("DOMContentLoaded", () => {
        let p = document.getElementById('t');
        this.length = p.textContent.length;
        console.log(p);
    })
  }

}

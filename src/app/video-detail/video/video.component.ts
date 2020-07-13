import { Component, OnInit ,Input} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() list;
  @Input() index;
  isSettingsDrop = false;
  isLoggedIn : Boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {

    this.loginService.currentLoggedIn.subscribe(login => this.isLoggedIn = login); 
  }

  addDropdown(e, id): void{
    if((e.target as HTMLElement).classList.contains('fa-ellipsis-v')){
      let dropdown = document.getElementById(`${id}`);
      // let allDropdown = document.querySelectorAll('.settings-dropdown');

      dropdown.classList.toggle('block');
    }
  }

}

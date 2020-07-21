import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-video-trending',
  templateUrl: './video-trending.component.html',
  styleUrls: ['./video-trending.component.scss']
})
export class VideoTrendingComponent implements OnInit {

  @Input() video: any;
  user: User;
  settings: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(this.video.user_id).valueChanges
      .subscribe(result => {
        this.user = result.data.getUser;
      })
  }

  addSettings(){
    this.settings = !this.settings;
  }

}

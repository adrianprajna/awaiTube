import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-video-aside',
  templateUrl: './video-aside.component.html',
  styleUrls: ['./video-aside.component.scss']
})
export class VideoAsideComponent implements OnInit {

  @Input() video: any;

  @Input() nextVideo: any;

  user: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(this.video.user_id).valueChanges
      .subscribe(result => this.user = result.data.getUser)   
  }

  navigate(){
    window.location.href = `/video-detail/${this.video.id}`;
  }

}

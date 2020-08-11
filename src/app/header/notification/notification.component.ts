import { Component, OnInit, Input } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private channelService: ChannelService, private userService: UserService) { }

  @Input() notif: any

  user: User

  thumbnail: boolean = false;

  ngOnInit(): void {

    if(this.notif.thumbnail != "no thumbnail"){
      this.thumbnail = true;
    }

    this.channelService.getChannel(this.notif.channel_id).valueChanges
      .subscribe(result => {
        this.userService.getUser(result.data.channel.user_id).valueChanges
          .subscribe(result => this.user = result.data.getUser)
      })
  }

}

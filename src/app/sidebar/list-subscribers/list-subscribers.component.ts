import { Component, OnInit, Input } from '@angular/core';
import { Obj, User } from 'src/app/type';
import { UserService } from 'src/app/services/user.service';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-list-subscribers',
  templateUrl: './list-subscribers.component.html',
  styleUrls: ['./list-subscribers.component.scss']
})
export class ListSubscribersComponent implements OnInit {

  constructor(private userService: UserService, private channelService: ChannelService) { }

  @Input() subscriber: Obj;

  user: User;

  id: number;

  ngOnInit(): void {  
    this.channelService.getChannel(this.subscriber.id).valueChanges
      .subscribe(res => {      
        this.userService.getUser(res.data.channel.user_id).valueChanges
          .subscribe(result => this.user = result.data.getUser);
      })
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss']
})
export class ChannelHeaderComponent implements OnInit {

  user: User;

  channel: any

  id: number

  constructor(private activatedRoute: ActivatedRoute, private channelService: ChannelService, private userService: UserService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));

      this.channelService.getChannel(this.id).valueChanges
        .subscribe(result => {
            this.channel = result.data.channel;
            
            this.userService.getUser(this.channel.user_id).valueChanges
              .subscribe(res => this.user = res.data.getUser);
        })
  })
    
  }

  navigate(link: string){
    window.location.href = `/channel/${this.id}/${link}`
  }
}

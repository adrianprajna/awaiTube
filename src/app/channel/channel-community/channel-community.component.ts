import {
  Component,
  OnInit
} from '@angular/core';
import {
  ChannelService
} from 'src/app/services/channel.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  User
} from 'src/app/type';
import {
  UserService
} from 'src/app/services/user.service';

@Component({
  selector: 'app-channel-community',
  templateUrl: './channel-community.component.html',
  styleUrls: ['./channel-community.component.scss']
})
export class ChannelCommunityComponent implements OnInit {

  constructor(private channelService: ChannelService, private activatedRoute: ActivatedRoute, private userService: UserService) {}

  id: number;

  posts: any;

  user: User;

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      this.getChannel();
      this.getAllPosts();
    })

  }


  getChannel() {
    this.channelService.getChannel(this.id).valueChanges
      .subscribe(result => {

        this.userService.getUser(result.data.channel.user_id).valueChanges
          .subscribe(res => {
            this.user = res.data.getUser;
          });

      })
  }

  getAllPosts() {
    this.channelService.getAllPosts(this.id)
      .valueChanges
      .subscribe(res => this.posts = res.data.posts);
  }

  addPost() {
    let description = (document.getElementById('desc') as HTMLInputElement).value;

    if (description == "") {
      alert('description must be filled!');
      return;
    }

    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let date = new Date();
    let join_date = `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    this.channelService.addPost(this.id, description, 'this is picture', join_date)
  }

}

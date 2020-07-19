import { Component, OnInit, Input } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  @Input() loginUser: SocialUser

  @Input() reply: any;

  user: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getUser(this.reply.user_id)
      .valueChanges
      .subscribe(result => this.user = result.data.getUser)
  }

}

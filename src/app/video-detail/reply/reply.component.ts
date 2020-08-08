import { Component, OnInit, Input } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  @Input() userByEmail: User

  @Input() reply: any;

  user: User;

  
  showReply: boolean = false;
  isReply: boolean = false;

  constructor(private userService: UserService, private commentService: CommentService) { }

  ngOnInit(): void {

    this.userService.getUser(this.reply.user_id)
      .valueChanges
      .subscribe(result => this.user = result.data.getUser)
  }

  dropReplyMenu() {
    if (this.userByEmail == undefined) {
      alert('you have to sign in first before replying a comment!');
      return;
    } else {
      this.isReply = true;
    }

  }

  cancelReplyMenu() {
    this.isReply = false;
  }

  showReplyMenu() {
    this.showReply = !this.showReply;
  }

  createReply(comment_id: number) {
    let description = document.getElementById('reply-text') as HTMLInputElement;
    let date = new Date();
    let user_id: number;

    if (description.value == "") {
      alert('reply cannot be blank!');
      return;
    }

    user_id = this.userByEmail.id as any

    this.commentService.createReply(comment_id, user_id, description.value, date.getDate(), date.getMonth() + 1);

    alert('success add a new reply!');

    (document.getElementById('reply-text') as HTMLInputElement).value = "";
  }
}

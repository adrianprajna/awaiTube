import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SocialUser } from 'angularx-social-login';
import { CommentService } from 'src/app/services/comment.service';
import { User } from 'src/app/type';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private userService: UserService, private commentService: CommentService) { }

  @Input() comment: any;

  day: string;

  user: User;

  replies: any;

  isReply: boolean = false;

  showReply: boolean = false;

  @Input() loginUser: SocialUser

  ngOnInit(): void {
    if(this.comment.day == 19){
      this.day = "Today";
    }

    this.userService.getUser(this.comment.user_id) 
      .valueChanges
      .subscribe(result => this.user = result.data.getUser);

    this.commentService.getAllReplies(this.comment.id).valueChanges
      .subscribe(result => this.replies = result.data.replies);
  }

  dropReplyMenu(){
    if(this.loginUser == undefined){
      alert('you have to sign in first before replying a comment!');
      return;
    }
    else {
      this.isReply = true;
    }
    
  }

  cancelReplyMenu(){
    this.isReply = false;
  }

  showReplyMenu(){
    this.showReply = !this.showReply;
  }

  reply(comment_id: number){
    let description = document.getElementById('reply-text') as HTMLInputElement;
    let date = new Date();
    let user_id: number;

    if(description.value == ""){
      alert('reply cannot be blank!');
      return;
    }

    this.userService.getUserByEmail(this.loginUser.email)
      .valueChanges
      .subscribe(result => {
        user_id = result.data.getUserByEmail.id;
        console.log(user_id + " " + comment_id);

        this.commentService.createReply(comment_id, user_id, description.value, date.getDate(), date.getMonth() + 1);

        alert('success add a new reply!');

        (document.getElementById('reply-text') as HTMLInputElement).value = "";
      });

      
    
  }

}

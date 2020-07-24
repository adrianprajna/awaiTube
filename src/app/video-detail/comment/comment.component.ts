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

  getUploadedDate(): string{
    let today = new Date();
    
    if(today.getFullYear() > this.comment.year){
      return today.getFullYear() - this.comment.year == 1 ? (today.getFullYear() - this.comment.year).toString() + " year ago" : (today.getFullYear() - this.comment.year).toString() + " years ago"
    }

    if(today.getMonth() > this.comment.month){
      return (today.getMonth() - this.comment.month) == 1 ? (today.getMonth() - this.comment.month).toString() + " month ago" : (today.getMonth() - this.comment.month).toString() + " months ago"
    }

    if(today.getDate() > this.comment.day){
      return (today.getDate() - this.comment.day) == 1 ? (today.getDate() - this.comment.day).toString() + " days ago" : (today.getDate() - this.comment.day).toString() + " days ago"
    }

    let comment: any = JSON.parse(this.comment.time)

    if(today.getHours() > comment.hour){
      return (today.getHours() - comment.hour) == 1 ? (today.getHours() - comment.hour).toString() + " hour ago" : (today.getHours() - comment.hour).toString() + " hours ago"
    }

    if(today.getMinutes() > comment.minute){
      return (today.getMinutes() - comment.minute) == 1 ? (today.getMinutes() - comment.minute).toString() + " minute ago" : (today.getMinutes() - comment.minute).toString() + " minutes ago"
    }

    if(today.getSeconds() > comment.second){
      return (today.getSeconds() - comment.second).toString() + " seconds ago"
    }
  
}

}

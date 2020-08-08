import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  UserService
} from 'src/app/services/user.service';
import {
  SocialUser
} from 'angularx-social-login';
import {
  CommentService
} from 'src/app/services/comment.service';
import {
  User,
  Obj
} from 'src/app/type';
import {
  Apollo
} from 'apollo-angular';
import {
  VideoService
} from 'src/app/services/video.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private userService: UserService, private commentService: CommentService, private apollo: Apollo) {}

  @Input() comment: any;

  day: string;

  user: User;

  replies: any;

  isReply: boolean = false;

  showReply: boolean = false;

  @Input() userByEmail: User

  ngOnInit(): void {
    if (this.comment.day == 19) {
      this.day = "Today";
    }

    this.userService.getUser(this.comment.user_id)
      .valueChanges
      .subscribe(result => this.user = result.data.getUser);

    this.commentService.getAllReplies(this.comment.id).valueChanges
      .subscribe(result => this.replies = result.data.replies);

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

  reply(comment_id: number) {
    let description = document.getElementById('reply-text') as HTMLInputElement;
    let date = new Date();
    let user_id: number;

    if (description.value == "") {
      alert('reply cannot be blank!');
      return;
    }

    user_id = this.userByEmail.id as any
    console.log(user_id + " " + comment_id);

    this.commentService.createReply(comment_id, user_id, description.value, date.getDate(), date.getMonth() + 1);

    alert('success add a new reply!');

    (document.getElementById('reply-text') as HTMLInputElement).value = "";
  }

  getUploadedDate(): string {
    let today = new Date();

    if (today.getFullYear() > this.comment.year) {
      return today.getFullYear() - this.comment.year == 1 ? (today.getFullYear() - this.comment.year).toString() + " year ago" : (today.getFullYear() - this.comment.year).toString() + " years ago"
    }

    if (today.getMonth() + 1 > this.comment.month) {
      return (today.getMonth() - this.comment.month + 1) == 1 ? (today.getMonth() - this.comment.month + 1).toString() + " month ago" : (today.getMonth() - this.comment.month + 1).toString() + " months ago"
    }

    if (today.getDate() > this.comment.day) {
      return (today.getDate() - this.comment.day) == 1 ? (today.getDate() - this.comment.day).toString() + " days ago" : (today.getDate() - this.comment.day).toString() + " days ago"
    }

    let comment: any = JSON.parse(this.comment.time)

    if (today.getHours() > comment.hour) {
      return (today.getHours() - comment.hour) == 1 ? (today.getHours() - comment.hour).toString() + " hour ago" : (today.getHours() - comment.hour).toString() + " hours ago"
    }

    if (today.getMinutes() > comment.minute) {
      return (today.getMinutes() - comment.minute) == 1 ? (today.getMinutes() - comment.minute).toString() + " minute ago" : (today.getMinutes() - comment.minute).toString() + " minutes ago"
    }

    if (today.getSeconds() > comment.second) {
      return (today.getSeconds() - comment.second).toString() + " seconds ago"
    }

  }

  likeComment() {

    if (this.userByEmail == null) {
      alert('you have to sign in first before like comment!');
      return;
    }

    let likedComment: Array < Obj > = JSON.parse(this.userByEmail.liked_comment);
    console.log(likedComment);
    console.log(this.userByEmail);


    let likeObj = {
      id: this.comment.id
    }

    let isLiked: boolean = false;
    let isDisliked: boolean = false;

    likedComment.forEach(vid => {
      if (vid.id == this.comment.id)
        isLiked = true;
    })

    if (!isLiked) {

      let dislikedComments: Array < Obj > = JSON.parse(this.userByEmail.disliked_comment)

      //check if user have already disliked the video or not
      dislikedComments.forEach((c, index) => {
        if (c.id == this.comment.id) {
          isDisliked = true;
          dislikedComments.splice(index, 1);
        }
      })

      if (isDisliked) {
        this.updateLikeAndDislike(-1, 1, dislikedComments, likedComment, likeObj, true)
      } else {
        this.updateLikeAndDislike(0, 1, dislikedComments, likedComment, likeObj, true);
      }

    }
  }

  dislikeComment() {
    if (this.userByEmail == null) {
      alert('you have to sign in first before dislike comment!');
      return;
    }

    let dislikedComments: Array < Obj > = JSON.parse(this.userByEmail.disliked_comment);

    let dislikeObj = {
      id: this.comment.id
    }

    let isLiked: boolean = false;
    let isDisliked: boolean = false;

    dislikedComments.forEach(vid => {
      if (vid.id == this.comment.id)
        isDisliked = true;
    })

    if (!isDisliked) {

      let likedComments: Array < Obj > = JSON.parse(this.userByEmail.liked_comment)

      //check if user have already liked the video or not
      likedComments.forEach((c, index) => {
        if (c.id == this.comment.id) {
          isLiked = true;
          likedComments.splice(index, 1);
        }
      })

      if (isLiked) {
        this.updateLikeAndDislike(1, -1, dislikedComments, likedComments, dislikeObj, false)
      } else {
        this.updateLikeAndDislike(1, 0, dislikedComments, likedComments, dislikeObj, false);
      }
    }
  }


  updateLikeAndDislike(dislike: number, like: number, dislikedVideos: Array < Obj > , likedVideos: Array < Obj > , obj: any, isCheck: boolean) {
    this.commentService.updateComment(this.comment, like, dislike).subscribe(result => {

      if (isCheck)
        likedVideos.push(obj);
      else
        dislikedVideos.push(obj);

      this.apollo.mutate({
        mutation: this.userService.updateUserQuery,
        variables: {
          id: this.userByEmail.id,
          name: this.userByEmail.name,
          email: this.userByEmail.email,
          img_url: this.userByEmail.img_url,
          premium: this.userByEmail.premium,
          subscribers: this.userByEmail.subscribers,
          liked_video: this.userByEmail.liked_video,
          disliked_video: this.userByEmail.disliked_video,
          liked_comment: JSON.stringify(likedVideos),
          disliked_comment: JSON.stringify(dislikedVideos),
          subscribed_channel: this.userByEmail.subscribed_channel,
          playlists: this.userByEmail.playlists,
          liked_post: this.userByEmail.liked_post,
          disliked_post: this.userByEmail.disliked_post
        },
        refetchQueries: [{
          query: this.userService.getUserByEmailQuery,
          variables: {
            email: this.userByEmail.email
          }
        }]
      }).subscribe();

    })
  }

}

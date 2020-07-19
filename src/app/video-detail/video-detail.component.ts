import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { UserService } from '../services/user.service';
import { User } from '../type';
import { CommentService } from '../services/comment.service';
import { LoginService } from '../services/login.service';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit {

  x = [
    12,
    13,
    14
  ]

  id: number;

  video: any;
  user: User;
  loginUser: SocialUser;
  comments: any;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, 
    private commentService: CommentService, private loginService: LoginService) { }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage();
      this.loginUser = this.loginService.user;
    }
    
    this.route.paramMap.subscribe(params => {
      this.id =  parseInt(params.get('id'));
    })

    this.getVideo(this.id);
    this.getAllComments(this.id)
  }

  getVideo(id: number){
    this.videoService.getVideo(id)
      .valueChanges
      .subscribe(result => {
        this.video = result.data.getVideo

        this.userService.getUser(this.video.user_id).valueChanges
          .subscribe((result) => this.user = result.data.getUser);
      });
  }

  getAllComments(video_id: number){
    this.commentService.getAllComments(video_id).valueChanges
      .subscribe(result => this.comments = result.data.getAllComments);
  }

  comment(){

    if(this.loginUser == null){
      alert('you have to sign in first before comment!');
      return;
    }

    let desc = document.getElementById('description') as HTMLInputElement;
    let date = new Date();

    if(desc.value == ""){
      alert('you have to fill the comment first!');
      return;
    }

    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(result => {
        let user_id = result.data.getUserByEmail.id;

        this.commentService.createComment(user_id, this.id, desc.value, date.getDate(), date.getMonth() + 1)
      })
  }

}

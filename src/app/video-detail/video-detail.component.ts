import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';
import { UserService } from '../services/user.service';
import { User } from '../type';
import { CommentService } from '../services/comment.service';

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
  comments: any;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, 
    private commentService: CommentService) { }

  ngOnInit(): void {
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

}

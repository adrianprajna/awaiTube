import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  VideoService
} from '../services/video.service';
import {
  UserService
} from '../services/user.service';
import {
  User,
  Obj
} from '../type';
import {
  CommentService
} from '../services/comment.service';
import {
  LoginService
} from '../services/login.service';
import {
  SocialUser
} from 'angularx-social-login';
import {
  Apollo
} from 'apollo-angular';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit {


  id: number;
  video: any;
  user: User;
  nextUser: User;
  loginUser: SocialUser;
  comments: any;
  userByEmail: any;
  videos: any;
  nextVideo: any;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService,
    private commentService: CommentService, private loginService: LoginService, private apollo: Apollo) {}

  ngOnInit(): void {

    if (localStorage.getItem('users') != null) {
      this.loginService.getUserFromStorage();
      this.loginUser = this.loginService.user;

      this.getUserByEmail();
    }

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      this.getVideo(this.id);
      this.getAllComments(this.id);  
    })

  }

  getVideo(id: number) {
    this.videoService.getVideo(id)
      .valueChanges
      .subscribe(result => {
        this.video = result.data.getVideo

        this.userService.getUser(this.video.user_id).valueChanges
          .subscribe((result) => this.user = result.data.getUser);  
          
        this.getAllVideos(this.video.category);  
      });
  } 

  
  

  getAllComments(video_id: number) {
    this.commentService.getAllComments(video_id).valueChanges
      .subscribe(result => this.comments = result.data.getAllComments);
  }

  getAllVideos(category: string){
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        this.videos = result.data.videos;
        this.videos = Array.from(this.videos).filter((v: any) => v.category == category && v.id != this.id);       
        this.nextVideo = this.videos.shift();       
      })
  }

  getUserByEmail() {
    this.userService.getUserByEmail(this.loginUser.email)
      .valueChanges
      .subscribe(result => {
        this.userByEmail = result.data.getUserByEmail;
        this.checkVideo(JSON.parse(this.userByEmail.liked_video), JSON.parse(this.userByEmail.disliked_video));
      });
  }

  checkVideo(likedVideos: Array < Obj > , dislikedVideos: Array < Obj > ) {
    likedVideos.forEach(vid => {
      if (vid.id == this.id) {
        document.getElementById('dislike').classList.remove('red');
        document.getElementById('like').classList.add('blue');
      }
    })

    dislikedVideos.forEach(vid => {
      if(vid.id == this.id){
        document.getElementById('like').classList.remove('blue');
        document.getElementById('dislike').classList.add('red');
      }
    })
  }

  comment() {

    if (this.loginUser == null) {
      alert('you have to sign in first before comment!');
      return;
    }

    let desc = document.getElementById('description') as HTMLInputElement;
    let date = new Date();

    if (desc.value == "") {
      alert('you have to fill the comment first!');
      return;
    }

    this.commentService.createComment(this.userByEmail.id, this.id, desc.value, date.getDate(), date.getMonth() + 1);
    alert('success add a new comment!');
  }

  likeVideo() {

    if (this.loginUser == null) {
      alert('you have to sign in first before like video!');
      return;
    }

    let likedVideos: Array < Obj > = JSON.parse(this.userByEmail.liked_video);

    let likeObj = {
      id: this.video.id
    }

    let isLiked: boolean = false;
    let isDisliked: boolean = false;

    likedVideos.forEach(vid => {
      if (vid.id == this.video.id)
        isLiked = true;
    })

    if (!isLiked) {

      let dislikedVideos: Array < Obj > = JSON.parse(this.userByEmail.disliked_video)

      //check if user have already disliked the video or not
      dislikedVideos.forEach((vid, index) => {
        if (vid.id == this.video.id) {
          isDisliked = true;
          dislikedVideos.splice(index, 1);
        }
      })

      if (isDisliked) {
        this.updateLikeAndDislike(-1, 1, dislikedVideos, likedVideos, likeObj, true)
      } else {
        this.updateLikeAndDislike(0, 1, dislikedVideos, likedVideos, likeObj, true);
      }

    }
  }


  dislikeVideo() {
    if (this.loginUser == null) {
      alert('you have to sign in first before dislike video!');
      return;
    }

    let dislikedVideos: Array < Obj > = JSON.parse(this.userByEmail.disliked_video);

    let dislikeObj = {
      id: this.video.id
    }

    let isLiked: boolean = false;
    let isDisliked: boolean = false;

    dislikedVideos.forEach(vid => {
      if (vid.id == this.video.id)
        isDisliked = true;
    })

    if (!isDisliked) {

      let likedVideos: Array < Obj > = JSON.parse(this.userByEmail.liked_video)

      //check if user have already liked the video or not
      likedVideos.forEach((vid, index) => {
        if (vid.id == this.video.id) {
          isLiked = true;
          likedVideos.splice(index, 1);
        }
      })

      if (isLiked) {
        this.updateLikeAndDislike(1, -1, dislikedVideos, likedVideos, dislikeObj, false)
      } else {
        this.updateLikeAndDislike(1, 0, dislikedVideos, likedVideos, dislikeObj, false);
      }
    }
  }


  updateLikeAndDislike(dislike: number, like: number, dislikedVideos: Array < Obj > , likedVideos: Array < Obj > , obj: any, isCheck: boolean) {
    this.apollo.mutate({
      mutation: this.videoService.updateQuery,
      variables: {
        id: this.video.id,
        user_id: this.video.user_id,
        title: this.video.title,
        url: this.video.url,
        description: this.video.description,
        category: this.video.category,
        location: this.video.location,
        views: this.video.views,
        day: this.video.day,
        month: this.video.month,
        year: this.video.year,
        thumbnail: this.video.thumbnail,
        likes: this.video.likes + like,
        dislikes: this.video.dislikes + dislike,
        age_restriction: this.video.age_restriction,
        privacy: this.video.privacy,
        premium: this.video.premium
      },
      refetchQueries: [{
        query: this.videoService.getVideoQuery,
        variables: {
          id: this.id
        }
      }]
    }).subscribe(result => {

      
      if(isCheck)
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
          liked_video: JSON.stringify(likedVideos),
          disliked_video: JSON.stringify(dislikedVideos),
          liked_comment: this.userByEmail.liked_comment,
          disliked_comment: this.userByEmail.disliked_comment
        },
        refetchQueries: [{
          query: this.userService.getUserByEmailQuery,
          variables: {
            email: this.loginUser.email
          }
        }]
      }).subscribe()
    })
  }
}

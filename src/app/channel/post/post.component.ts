import { Component, OnInit, Input } from '@angular/core';
import { User, Obj } from 'src/app/type';
import { Apollo } from 'apollo-angular';
import { ChannelService } from 'src/app/services/channel.service';
import gql from 'graphql-tag';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;
  @Input() user: User;

  @Input() userByEmail: User

  isImgExists: boolean = false

  isCheck: boolean = false;

  isLike: boolean = false;
  isDislike: boolean = false;


  constructor(private apollo: Apollo, private channelService: ChannelService, private userService: UserService) { }

  ngOnInit(): void {
    if(this.post.picture != "no picture"){
        this.isImgExists = true
    }  
    
    this.checkVideo(JSON.parse(this.userByEmail.liked_post), JSON.parse(this.userByEmail.disliked_post))
  }

  checkVideo(likedPost: Array < Obj > , dislikedPost: Array < Obj > ) {
 
    likedPost.forEach(post => {
      if (post.id == this.post.id) {
        this.isLike = true
        this.isDislike = false
      }
    })

    dislikedPost.forEach(post => {
      if (post.id == this.post.id) {
        this.isDislike = true
        this.isLike = false
      }
    }) 
  }

  likePost() {

    if (this.userByEmail == null) {
      alert('you have to sign in first before like post!');
      return;
    }

    let liked_post: Array < Obj > = JSON.parse(this.userByEmail.liked_post);

    let likeObj = {
      id: this.post.id
    }

    let isLiked: boolean = false;
    let isDisliked: boolean = false;

    liked_post.forEach(post => {
      if (post.id == this.post.id)
        isLiked = true;
    })

    if (!isLiked) {

      let dislikedPost: Array < Obj > = JSON.parse(this.userByEmail.disliked_post)

      //check if user have already disliked the video or not
      dislikedPost.forEach((vid, index) => {
        if (vid.id == this.post.id) {
          isDisliked = true;
          dislikedPost.splice(index, 1);
        }
      })

      if (isDisliked) {
        this.updateLikeAndDislike(-1, 1, dislikedPost, liked_post, likeObj, true)
      } else {
        this.updateLikeAndDislike(0, 1, dislikedPost, liked_post, likeObj, true);
      }

    }
  }

  dislikePost() {
    if (this.userByEmail == null) {
      alert('you have to sign in first before dislike post!');
      return;
    }

    let dislikedPost: Array < Obj > = JSON.parse(this.userByEmail.disliked_post);

    let dislikeObj = {
      id: this.post.id
    }

    let isLiked: boolean = false;
    let isDisliked: boolean = false;

    dislikedPost.forEach(vid => {
      if (vid.id == this.post.id)
        isDisliked = true;
    })

    if (!isDisliked) {

      let likedPost: Array < Obj > = JSON.parse(this.userByEmail.liked_post)

      //check if user have already liked the video or not
      likedPost.forEach((vid, index) => {
        if (vid.id == this.post.id) {
          isLiked = true;
          likedPost.splice(index, 1);
        }
      })

      if (isLiked) {
        this.updateLikeAndDislike(1, -1, dislikedPost, likedPost, dislikeObj, false)
      } else {
        this.updateLikeAndDislike(1, 0, dislikedPost, likedPost, dislikeObj, false);
      }
    }
  }


  updateLikeAndDislike(dislike: number, like: number, dislikedVideos: Array < Obj > , likedVideos: Array < Obj > , obj: any, isCheck: boolean) {

    this.apollo.mutate({
      mutation: this.channelService.updatePostQuery,
      variables: {
        id: this.post.id,
        channel_id: this.post.channel_id,
        description: this.post.description,
        picture: this.post.picture,
        date: this.post.date,
        likes: this.post.likes + like,
        dislikes: this.post.dislikes + dislike,
        title: this.post.title
      },
      refetchQueries: [{
        query: this.channelService.getPostQuery,
        variables: {
        channel_id: this.post.id as any
      }
      }]
    }).subscribe(result => {


      if (isCheck)
        likedVideos.push(obj);
      else
        dislikedVideos.push(obj);

      console.log(likedVideos);
      console.log(dislikedVideos);      

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
          liked_comment: this.userByEmail.liked_comment,
          disliked_comment: this.userByEmail.disliked_comment,
          subscribed_channel: this.userByEmail.subscribed_channel,
          playlists: this.userByEmail.playlists,
          liked_post: JSON.stringify(likedVideos),
          disliked_post: JSON.stringify(dislikedVideos)
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

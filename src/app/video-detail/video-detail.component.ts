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
import {
  ChannelService
} from '../services/channel.service';
import {
  PlaylistService
} from '../playlist.service';

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
  userByEmail: User;
  videos: Array < any > ;
  nextVideo: any;
  channel: any;
  playlists: Array < any > = new Array;
  playlist_json: Array < Obj >
    isKeyboardActive: boolean = false;
  isViewed: boolean = false;
  isDownload: boolean = false;
  isSort: boolean = false;
  isSubscribed: boolean = false;
  isGetAllVideos: boolean = false;
  isPlaylistExists: boolean = false;
  isModalDrop: boolean = false;
  createDropdown: boolean = false;
  observer: IntersectionObserver;
  observerVideo: IntersectionObserver
  displayedComments: number = 2;
  displayedVideos: number = 6;

  videosFromPlaylist: Array < any > = new Array
  relatedPlaylist: any;
  category: string;
  ranges = [{
      divider: 1e18,
      suffix: 'E'
    },
    {
      divider: 1e15,
      suffix: 'P'
    },
    {
      divider: 1e12,
      suffix: 'T'
    },
    {
      divider: 1e9,
      suffix: 'B'
    },
    {
      divider: 1e6,
      suffix: 'M'
    },
    {
      divider: 1e3,
      suffix: 'k'
    }
  ];

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService,
    private commentService: CommentService, private loginService: LoginService, private apollo: Apollo, private channelService: ChannelService, private playlistService: PlaylistService) {}

  ngOnInit(): void {

    if (localStorage.getItem('users') != null) {
      this.loginService.getUserFromStorage();
      this.loginUser = this.loginService.user;
      this.getUserByEmail();
    }

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      console.log(this.id);
      this.getVideo(this.id);
      this.getAllComments(this.id);
    })

    this.route.queryParams
      .subscribe(params => {
        if (Object.keys(params).length != 0) {
          this.isPlaylistExists = true;
          this.playlistService.getPlaylist(parseInt(params.playlist)).valueChanges
            .subscribe(result => {
              this.relatedPlaylist = result.data.playlist
              let relatedVideosPlaylist: Array < any > = JSON.parse(this.relatedPlaylist.videos);
              this.videosFromPlaylist = new Array;
              relatedVideosPlaylist.forEach((vid: any) => {
                this.videoService.getVideo(vid.id).valueChanges
                  .subscribe(res => {
                    this.videosFromPlaylist.push(res.data.getVideo)
                  })
              })
            })
        }
      })

    this.rightClickEvent()
    this.infiniteComment();
    // this.infiniteVideo();
  }

  infiniteComment() {
    this.observer = new IntersectionObserver(entry => {
      if (entry[0].isIntersecting) {

        for (let i = 0; i < 4; i++) {
          if (this.displayedComments < this.comments.length) {
            let div = document.createElement('div');
            let comment = document.createElement('app-comment')
            comment.setAttribute('comment', 'this.comments[this.displayedComments]');
            comment.setAttribute('userByEmail', 'this.userByEmail')
            div.appendChild(comment);
            let row = document.querySelector('.comment-details');
            row.appendChild(div);
            this.displayedComments++;
          }
        }
      }
    })

    this.observer.observe(document.getElementById('footer'));
  }

  infiniteVideo() {
    this.observerVideo = new IntersectionObserver(entry => {
      if (entry[0].isIntersecting) {

        for (let i = 0; i < 4; i++) {
          if (this.displayedVideos < this.videos.length) {
            let video = document.createElement('app-video-aside')
            video.setAttribute('video', 'this.videos[this.displayedVideos]');
            video.setAttribute('nextVideo', 'this.nextVideo')
            let row = document.querySelector('.infinite');
            row.appendChild(video);
            this.displayedVideos++;
          }
        }
      }
    })

    this.observerVideo.observe(document.getElementById('footer-video'));
  }


  addModal(): void {
    this.isModalDrop = !this.isModalDrop
    this.playlistService.videoBehaviour.next(this.id);
  }

  addCreateDropdown(): void {
    this.createDropdown = !this.createDropdown;
  }


  getAllPlaylist(playlist_json: Array < Obj > ) {
    playlist_json.forEach((playlist: any) => {
      this.playlistService.getPlaylist(playlist.id).valueChanges
        .subscribe(res => {
          if (this.playlists.length != 0) {
            if (!this.playlists.includes(res.data.playlist))
              this.playlists.push(res.data.playlist)
          } else {
            this.playlists.push(res.data.playlist)
          }
          this.playlists = this.playlists.filter((playlist: any) => playlist.user_id == this.userByEmail.id)
        })
    })
  }

  createPlaylist() {
    let input = document.getElementById('input-create') as HTMLInputElement
    let privacy = "Public";
    let privacies = document.getElementsByName('privacy');

    privacies.forEach(p => {
      if ((p as HTMLInputElement).checked && (p as HTMLInputElement).value == "Private") {
        privacy = "Private";
      }
    })

    this.playlistService.createPlaylist(this.userByEmail.id as any, input.value, privacy, "this is a description")
      .subscribe((res: any) => {

        let id: Obj = {
          id: parseInt(res.data.createPlaylist.id)
        }
        this.playlist_json.push(id)
        console.log(this.playlist_json);

        this.apollo.mutate({
          mutation: this.userService.updateUserQuery,
          variables: {
            id: this.user.id,
            name: this.user.name,
            email: this.user.email,
            img_url: this.user.img_url,
            premium: this.user.premium,
            subscribers: this.user.subscribers,
            liked_video: this.user.liked_video,
            disliked_video: this.user.disliked_video,
            liked_comment: this.user.liked_comment,
            disliked_comment: this.user.disliked_comment,
            subscribed_channel: this.user.subscribed_channel,
            playlists: JSON.stringify(this.playlist_json),
            liked_post: this.user.liked_post,
            disliked_post: this.user.disliked_post
          }
        }).subscribe()

      })

  }

  getVideo(id: number) {
    this.videoService.getVideo(id)
      .valueChanges
      .subscribe(result => {
        this.video = result.data.getVideo
        this.getAllVideos(this.video.category);

        this.userService.getUser(this.video.user_id).valueChanges
          .subscribe((result) => {
            this.user = result.data.getUser
            this.getChannel();
          });
      });
  }

  getAllComments(video_id: number) {
    this.commentService.getAllComments(video_id).valueChanges
      .subscribe(result => {
        this.comments = result.data.getAllComments
        this.updateView();
      });
  }

  getAllVideos(category: string) {
    // if (!this.isGetAllVideos) {
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        // if (!this.isGetAllVideos) {
        this.videos = result.data.videos;
        this.videos = Array.from(this.videos).filter((vid: any) => vid.category == category)
        this.nextVideo = this.videos[this.rand(0, this.videos.length)]
        this.isGetAllVideos = true;
        // }
      })
    // }
  }

  rand(min: number, max: number) {
    let randomNum = Math.random() * (max - min) + min;
    return Math.floor(randomNum);
  }

  getUserByEmail() {
    this.userService.getUserByEmail(this.loginUser.email)
      .valueChanges
      .subscribe(result => {
        this.userByEmail = result.data.getUserByEmail;
        this.playlist_json = JSON.parse(this.userByEmail.playlists)
        this.getAllPlaylist(this.playlist_json);
        this.userByEmail.premium == true ? this.isDownload = true : this.isDownload = false;
        this.checkVideo(JSON.parse(this.userByEmail.liked_video), JSON.parse(this.userByEmail.disliked_video));
      });
  }

  getChannel() {
    this.channelService.getChannelByUser(this.user.id as any).valueChanges
      .subscribe(result => {
        this.channel = result.data.getChannelByUser
        this.checkSubscribe()
      });
  }

  checkSubscribe() {
    let subscribed_channel: Array < Obj > = JSON.parse(this.userByEmail.subscribed_channel)
    subscribed_channel.forEach(channel => {
      if (channel.id == this.channel.id) {
        this.isSubscribed = true;
      }
    })
  }

  checkVideo(likedVideos: Array < Obj > , dislikedVideos: Array < Obj > ) {
    likedVideos.forEach(vid => {
      if (vid.id == this.id) {
        document.getElementById('dislike').classList.remove('red');
        document.getElementById('like').classList.add('blue');
      }
    })

    dislikedVideos.forEach(vid => {
      if (vid.id == this.id) {
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

    let time = {
      second: date.getSeconds(),
      minute: date.getMinutes(),
      hour: date.getHours()
    }
    this.commentService.createComment(this.userByEmail.id as any, this.id, desc.value, date.getDate(), date.getMonth() + 1, JSON.stringify(time));
    alert('success add a new comment!');
    desc.value = "";
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
        premium: this.video.premium,
        length: this.video.length,
        time: this.video.time
      },
      refetchQueries: [{
        query: this.videoService.getVideoQuery,
        variables: {
          id: this.id
        }
      }]
    }).subscribe(result => {


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
          liked_video: JSON.stringify(likedVideos),
          disliked_video: JSON.stringify(dislikedVideos),
          liked_comment: this.userByEmail.liked_comment,
          disliked_comment: this.userByEmail.disliked_comment,
          subscribed_channel: this.userByEmail.subscribed_channel,
          playlists: this.userByEmail.playlists,
          liked_post: this.userByEmail.liked_post,
          disliked_post: this.userByEmail.disliked_post
        },
        refetchQueries: [{
          query: this.userService.getUserByEmailQuery,
          variables: {
            email: this.loginUser.email
          }
        }]
      }).subscribe();
    })
  }

  updateView(): void {

    this.apollo.mutate({
      mutation: this.videoService.updateQuery,
      variables: {
        id: this.id,
        user_id: this.video.user_id,
        title: this.video.title,
        url: this.video.url,
        description: this.video.description,
        category: this.video.category,
        location: this.video.location,
        views: this.video.views + 1,
        day: this.video.day,
        month: this.video.month,
        year: this.video.year,
        thumbnail: this.video.thumbnail,
        likes: this.video.likes,
        dislikes: this.video.dislikes,
        age_restriction: this.video.age_restriction,
        privacy: this.video.privacy,
        premium: this.video.premium,
        length: this.video.length,
        time: this.video.time
      }
    }).subscribe(result => this.isViewed = true)
  }

  addKeyboard(): void {
    this.isKeyboardActive = !this.isKeyboardActive

    if (this.isKeyboardActive) {
      let video = document.getElementById('v').querySelector('video') as HTMLVideoElement
      document.onkeyup = (e) => {
        e.preventDefault()
        if (e.keyCode == 74 && this.isKeyboardActive == true) {
          video.currentTime -= 10;
        } else if (e.keyCode == 76 && this.isKeyboardActive == true) {
          video.currentTime += 10;
        } else if (e.keyCode == 75 && this.isKeyboardActive == true) {
          video.paused == true ? video.play() : video.pause();
        }
      }
    }
  }

  getDate(): string {
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${month[this.video.month - 1]} ${this.video.day}, ${this.video.year}`
  }

  convertMetric(num: number): string {
    for (let i: number = 0; i < this.ranges.length; i++) {
      if (num >= this.ranges[i].divider) {
        return Math.floor((num / this.ranges[i].divider)).toString() + this.ranges[i].suffix
      }
    }

    return num.toString();
  }

  convertToComma(num: number) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  addSort() {
    this.isSort = !this.isSort;
  }

  getTopLiked() {
    this.comments = Array.from(this.comments).sort((a: any, b: any) => a.likes < b.likes ? 1 : -1)
    this.addSort()
  }

  getNewest() {
    this.comments = Array.from(this.comments).sort((a: any, b: any) => a.id < b.id ? 1 : -1)
    this.addSort()
  }

  getVideoLength(totalSeconds: number): string{
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
  
    if(hours > 0){
      return String(hours).padStart(2, "0") + ":" + 
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }else{
      return String(minutes).padStart(2, "0") + 
      ":" + String(seconds).padStart(2, "0");
    }
  }

  subscribeChannel() {

    if (this.loginUser == null) {
      alert('you have to sign in first before subscribe channel!');
      return;
    }

    let subscribed_channel: Array < Obj > = JSON.parse(this.userByEmail.subscribed_channel);
    let object: Obj;

    object = {
      id: this.channel.id
    }

    subscribed_channel.push(object);

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
        subscribed_channel: JSON.stringify(subscribed_channel),
        playlists: this.userByEmail.playlists,
        liked_post: this.userByEmail.liked_post,
        disliked_post: this.userByEmail.disliked_post
      },
      refetchQueries: [{
        query: this.userService.getUserByEmailQuery,
        variables: {
          email: this.loginUser.email
        }
      }]
    }).subscribe(res => {
      this.increaseSubscriber(1);
      alert('successfuly subscribe this channel!')
    });
  }

  unsubscribeChannel() {

    let subscribed_channel: Array < Obj > = JSON.parse(this.userByEmail.subscribed_channel);

    subscribed_channel.forEach((channel, index) => {
      if (channel.id == this.channel.id) {
        this.isSubscribed = false;
        subscribed_channel.splice(index, 1);
      }
    })

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
        subscribed_channel: JSON.stringify(subscribed_channel),
        playlists: this.userByEmail.playlists,
        liked_post: this.userByEmail.liked_post,
        disliked_post: this.userByEmail.disliked_post
      },
      refetchQueries: [{
        query: this.userService.getUserByEmailQuery,
        variables: {
          email: this.loginUser.email
        }
      }]
    }).subscribe(res => {
      this.increaseSubscriber(-1);
      alert('unsubscribe this channel successful!')
    });
  }

  increaseSubscriber(subs: number) {
    this.apollo.mutate({
      mutation: this.userService.updateUserQuery,
      variables: {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        img_url: this.user.img_url,
        premium: this.user.premium,
        subscribers: this.user.subscribers + subs,
        liked_video: this.user.liked_video,
        disliked_video: this.user.disliked_video,
        liked_comment: this.user.liked_comment,
        disliked_comment: this.user.disliked_comment,
        subscribed_channel: this.user.subscribed_channel,
        playlists: this.user.playlists,
        liked_post: this.userByEmail.liked_post,
        disliked_post: this.userByEmail.disliked_post
      }
    }).subscribe(res => console.log(res.data));
  }

  navigate() {
    window.location.href = `/video-detail/${this.nextVideo.id}`;
  }

  rightClickEvent() {
    let video = document.querySelector('#v')

  }
}

import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { Apollo } from 'apollo-angular';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/type';
import { type } from 'os';

@Component({
  selector: 'app-channel-customize',
  templateUrl: './channel-customize.component.html',
  styleUrls: ['./channel-customize.component.scss']
})
export class ChannelCustomizeComponent implements OnInit {


  hover: boolean = false
  id: number
  channel: any
  user: User
  videos: Array<any>

  video: any

  isModalDrop: boolean = false;

  taskThumbnail: AngularFireUploadTask

  percentageThumbnail: Observable<number>;

  snapshotThumbnail: Observable<any>;

  downloadThumbnailURL: string = "no picture";

  isThumbnailDone: Boolean = false;

  pictureType: number = 3;

  backgroundHover: boolean = false

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private videoService: VideoService, private activatedRoute: ActivatedRoute, private channelService: ChannelService, private apollo: Apollo, private userService: UserService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      this.getChannel();
    })

  }

  addHover(){
    this.hover = !this.hover;
  }

  addBackgroundHover(){
    this.backgroundHover = !this.backgroundHover;
  }

  editVideo(id: number){
    this.isModalDrop = !this.isModalDrop;
    this.videoService.getVideo(id).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      this.prepareValue();
    })
  }

  prepareValue(): void {
    (document.getElementById('thumbnail-video') as HTMLElement).innerHTML = this.video.thumbnail;
    (document.getElementById('title-video') as HTMLInputElement).value = this.video.title;
    (document.getElementById('desc-video') as HTMLInputElement).value = this.video.description;
    let pub = document.getElementById('public-video') as HTMLInputElement;
    let priv = document.getElementById('private-video') as HTMLInputElement;
    this.video.privacy == "Public" ? pub.checked = true : priv.checked = true;
  }

  submitValue(): void {
    let title = document.getElementById('title-video') as HTMLInputElement
    let description = document.getElementById('desc-video') as HTMLInputElement
    let pub = document.getElementById('public-video') as HTMLInputElement;
    let priv = document.getElementById('private-video') as HTMLInputElement;
    let thumbnail = "";
    let privacy = ""

    this.downloadThumbnailURL == "no picture" ? thumbnail = document.getElementById('thumbnail-video').innerHTML : thumbnail = this.downloadThumbnailURL;
    pub.checked == true ? privacy = "Public" : privacy = "Private";

    console.log(title.value);
    console.log(description.value);
    console.log(thumbnail);
    console.log(privacy);
    this.apollo.mutate({
      mutation: this.videoService.updateQuery,
      variables: {
        id: this.video.id,
        user_id: this.video.user_id,
        title: title.value,
        url: this.video.url,
        description: description.value,
        category: this.video.category,
        location: this.video.location,
        views: this.video.views,
        day: this.video.day,
        month: this.video.month,
        year: this.video.year,
        thumbnail: thumbnail,
        likes: this.video.likes,
        dislikes: this.video.dislikes,
        age_restriction: this.video.age_restriction,
        privacy: privacy,
        premium: this.video.premium,
        length: this.video.length,
        time: this.video.time
      },
      refetchQueries: [{
        query: this.videoService.getVideoQuery,
        variables: {
          id: this.video.id
        }
      }]
    }).subscribe(result => this.isModalDrop = !this.isModalDrop)
  }

  getChannel() {
    this.channelService.getChannel(this.id).valueChanges
      .subscribe(result => {
        this.channel = result.data.channel;
        this.getUser();
        this.getAllVideos();
      })
  }

  getUser(){
    this.userService.getUser(this.channel.user_id).valueChanges
      .subscribe(result => this.user = result.data.getUser);
  }

  getAllVideos(){
    this.videoService.getAllVideos().valueChanges
      .subscribe(result => {
        this.videos = result.data.videos
        this.videos = this.videos.filter((vid: any) => vid.user_id == this.channel.user_id)
      })
  }

  startUploadThumbnail(file: File){
    const path = `background/${Date.now()}_${file.name}`;

    const ref = this.storage.ref(path);

    this.taskThumbnail = this.storage.upload(path, file);

    this.percentageThumbnail = this.taskThumbnail.percentageChanges();

    this.snapshotThumbnail   = this.taskThumbnail.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.downloadThumbnailURL = await ref.getDownloadURL().toPromise();

        this.db.collection('files').add( { downloadURL: this.downloadThumbnailURL, path });
        this.isThumbnailDone = true;
        alert('success uploaded picture!')

        if (this.pictureType == 1) {
          this.channel.background_url = this.downloadThumbnailURL;
          this.apollo.mutate({
            mutation: this.channelService.updateChannelQuery,
            variables: {
            id: this.id,
            user_id: this.channel.user_id,
            background_url: this.downloadThumbnailURL,
            description: this.channel.description,
            join_date: this.channel.join_date,
            links: this.channel.links
            }
          }).subscribe() 
        }
        
        else if (this.pictureType == 2) {
          this.user.img_url = this.downloadThumbnailURL;
          this.apollo.mutate({
            mutation: this.userService.updateUserQuery,
            variables: {
              id: this.user.id,
              name: this.user.name,
              email: this.user.email,
              img_url: this.downloadThumbnailURL,
              premium: this.user.premium,
              subscribers: this.user.subscribers,
              liked_video: this.user.liked_video,
              disliked_video: this.user.disliked_video,
              liked_comment: this.user.liked_comment,
              disliked_comment: this.user.disliked_comment,
              subscribed_channel: this.user.subscribed_channel,
              playlists: this.user.playlists,
              liked_post: this.user.liked_post,
              disliked_post: this.user.disliked_post
            }
          }).subscribe()
        }
    
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  deleteVideo(id: number){
    this.videoService.deleteVideo(id);
  }

  onDropThumbnail(files: FileList, type: number){
    this.pictureType = type;
    this.startUploadThumbnail(files.item(0)); 
  }


}

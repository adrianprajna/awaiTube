import {
  Component,
  OnInit
} from '@angular/core';
import {
  ChannelService
} from 'src/app/services/channel.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  User
} from 'src/app/type';
import {
  UserService
} from 'src/app/services/user.service';
import { SocialUser } from 'angularx-social-login';
import { LoginService } from 'src/app/services/login.service';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-channel-community',
  templateUrl: './channel-community.component.html',
  styleUrls: ['./channel-community.component.scss']
})
export class ChannelCommunityComponent implements OnInit {

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private channelService: ChannelService, private activatedRoute: ActivatedRoute, private userService: UserService, private loginService: LoginService) {}

  id: number;

  posts: any;

  user: User;

  loginUser: SocialUser

  isInput: boolean = false;

  taskThumbnail: AngularFireUploadTask

  percentageThumbnail: Observable<number>;

  snapshotThumbnail: Observable<any>;

  downloadThumbnailURL: string = "no picture";

  isThumbnailDone: Boolean = false;

  userByEmail: User

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage();
      this.loginUser = this.loginService.user
    }

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id'));
      this.getChannel();
      this.getAllPosts();
    })

  }

  getUserByEmail(){
    this.userService.getUserByEmail(this.loginUser.email).valueChanges
      .subscribe(result => {
        this.userByEmail = result.data.getUserByEmail
        if(result.data.getUserByEmail.id == this.user.id){
            this.isInput = true;
        }
      })
  }


  getChannel() {
    this.channelService.getChannel(this.id).valueChanges
      .subscribe(result => {

        this.userService.getUser(result.data.channel.user_id).valueChanges
          .subscribe(res => {
            this.user = res.data.getUser;
            this.getUserByEmail();
          });

      })
  }

  getAllPosts() {
    this.channelService.getAllPosts(this.id)
      .valueChanges
      .subscribe(res => this.posts = res.data.posts);
  }

  addPost() {
    let description = (document.getElementById('desc') as HTMLInputElement)
    let title = document.getElementById('t') as HTMLInputElement

    if (description.value == "" || title.value == "") {
      alert('description must be filled!');
      return;
    }

    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let date = new Date();
    let join_date = `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    
    this.channelService.addPost(this.id, description.value, this.downloadThumbnailURL, join_date, title.value)
    alert('successfuly posted a new post!');
    title.value = ""
    description.value = ""
  }

  startUploadThumbnail(file: File){
    const path = `thumbnails/${Date.now()}_${file.name}`;

    const ref = this.storage.ref(path);

    this.taskThumbnail = this.storage.upload(path, file);

    this.percentageThumbnail = this.taskThumbnail.percentageChanges();

    this.snapshotThumbnail   = this.taskThumbnail.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.downloadThumbnailURL = await ref.getDownloadURL().toPromise();

        this.db.collection('files').add( { downloadURL: this.downloadThumbnailURL, path });
        this.isThumbnailDone = true;
        alert('success uploaded thumbnail!');
        console.log(this.isThumbnailDone);
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  onDropThumbnail(files: FileList){
    this.startUploadThumbnail(files.item(0)); 
  }

  

  

}

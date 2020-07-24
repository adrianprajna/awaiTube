import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { VideoService } from 'src/app/services/video.service';
import { UserService } from 'src/app/services/user.service';
import { SocialUser } from 'angularx-social-login';
import { LoginService } from 'src/app/services/login.service';
import { url } from 'inspector';
import { Router } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  files: File[] = [];

  isHovering: Boolean;
  isValid: Boolean = false;
  isThumbnail: Boolean = false;

  isVideoDone: boolean = false;
  isThumbnailDone: boolean = false;

  task: AngularFireUploadTask;
  taskThumbnail: AngularFireUploadTask

  percentage: Observable<number>;
  percentageThumbnail: Observable<number>;

  snapshot: Observable<any>;
  snapshotThumbnail: Observable<any>;

  downloadURL: string;
  downloadThumbnailURL: string;

  fileName: string;

  title: string = "";
  description: string = "";
  selectControl: FormControl = new FormControl()

  user: SocialUser
  
  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private videoService: VideoService, private userService: UserService, private loginService: LoginService, private router:Router) { }

  ngOnInit() {
    this.loginService.getUserFromStorage();
    this.user = this.loginService.user;
  }

  toggleHover(e: boolean) {
    this.isHovering = e;
  }

  onDrop(files: FileList) {
     this.files.push(files.item(0));
     this.isValid = true;
     this.startUpload(files.item(0));
  }

  onDropThumbnail(files: FileList){
    this.startUploadThumbnail(files.item(0));
    this.isThumbnail = true;
  }

  startUpload(file: File) {
    const path = `videos/${Date.now()}_${file.name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, file);

    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.db.collection('files').add( { downloadURL: this.downloadURL, path });
        alert('success uploaded video!');
        this.fileName = file.name;
        this.isVideoDone = true;
      }),
    );

  }

  startUploadThumbnail(file: File){
    const path = `thumbnails/${Date.now()}_${file.name}`;

    const ref = this.storage.ref(path);

    this.taskThumbnail = this.storage.upload(path, file);

    this.percentageThumbnail = this.taskThumbnail.percentageChanges();

    this.snapshotThumbnail   = this.taskThumbnail.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
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


  upload(){
    let title = document.getElementById('title') as HTMLInputElement;
    let desc = document.getElementById('description') as HTMLInputElement;
    let restrictions = document.getElementsByName('age');
    let privacies = document.getElementsByName('privacy');
    let premiums = document.getElementsByName('premium');
    let privacy: string = "Public";
    let isRestricted: boolean = false;
    let isPremium: boolean = true;
    let date = new Date;
    let video = document.getElementById('vid') as HTMLVideoElement;
    let time = {
      second: date.getSeconds(),
      minute: date.getMinutes(),
      hour: date.getHours()
    }

    restrictions.forEach(age => {
      if((age as HTMLInputElement).checked && (age as HTMLInputElement).value == "Yes"){
        isRestricted = true;
      }
    })

    privacies.forEach(p => {
      if((p as HTMLInputElement).checked && (p as HTMLInputElement).value == "Private") {
        privacy = "Private";
      }
    })

    premiums.forEach(p => {
      if((p as HTMLInputElement).checked && (p as HTMLInputElement).value == "No"){
        isPremium = false;
      }
    })

    if(title.value == "" || desc.value == "" || this.selectControl.value == null){
      alert('please fill all input!');
      return;
    }

    console.log(date.getSeconds());
    console.log(date.getMinutes());
    console.log(date.getHours());
    
    

    this.userService.getUserByEmail(this.user.email).valueChanges
      .subscribe(result => {
        let user_id = result.data.getUserByEmail.id;

        this.videoService.createVideo(user_id, title.value, this.downloadURL, desc.value, this.selectControl.value, 'Indonesia', date.getDate(), date.getMonth() + 1, this.downloadThumbnailURL, isRestricted, privacy, isPremium, Math.floor(video.duration), JSON.stringify(time))
          .subscribe(result => {
            alert('success publish video!');
            this.router.navigate(['']);
          });
      })

    
  }
}

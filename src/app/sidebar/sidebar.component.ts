import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { SocialUser } from 'angularx-social-login';
import { UserService } from '../services/user.service';
import { Obj } from '../type';
import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() active: boolean;

  user: SocialUser

  subscribers: Array<Obj>;

  playlists_json: Array<Obj>;
  playlists: Array<any>;

  displayedPlaylist: number = 5;
  displayedSubs: number = 10;
  showAll: boolean = false;
  showAllSubs: boolean = false;

  constructor(private route:Router, private loginService: LoginService, private userService: UserService, private playlistService: PlaylistService) { 
    
  }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null){
      this.loginService.getUserFromStorage();
      this.user = this.loginService.user;
      this.getUserByEmail()
    }

    this.addActiveClass();
  }

  addActiveClass(){

    document.addEventListener('DOMContentLoaded', () => {
        let lists = document.querySelectorAll('.list');

        lists.forEach((list) => {
            list.addEventListener('click', function(e){
              // remove all class active
              lists.forEach((list) => {
                list.classList.remove('active');
              })

              console.log(this);
              this.classList.add('active');  
            
            });
        })
      })
    }

  removeActiveClass(){
    document.addEventListener('DOMContentLoaded', function(){
      let lists = document.querySelectorAll('.list');
      console.log(lists);

      lists.forEach((list) => {
        list.classList.remove('active');
      })
    })
  }

  navigate(link: string){
    this.loginService.changeActive(!this.active);
    this.route.navigate([link]);
  }
  
  getUserByEmail(){
    this.userService.getUserByEmail(this.user.email).valueChanges
      .subscribe(res => {
        this.subscribers = JSON.parse(res.data.getUserByEmail.subscribed_channel)
        this.playlists_json = JSON.parse(res.data.getUserByEmail.playlists);
        this.getAllPlaylists();       
      })
  }

  getAllPlaylists(){
    this.playlists = new Array;

    Array.from(this.playlists_json).forEach((vid: any) => {
        this.playlistService.getPlaylist(vid.id).valueChanges
          .subscribe(res => {
            this.playlists.push(res.data.playlist)            
          })
    })  

  }

  showAllPlaylist(){
    this.displayedPlaylist = this.playlists.length;
    this.showAll = true;
  }

  addPlaylistDropdown(){
    this.displayedPlaylist = 5;
    this.showAll = !this.showAll;
  }

  showAllSubscribers(length: number): void{
    this.showAllSubs = !this.showAllSubs;
    this.displayedSubs = length;
  }


}

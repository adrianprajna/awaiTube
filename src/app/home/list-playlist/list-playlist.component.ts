import { Component, OnInit, Input } from '@angular/core';
import { Obj } from 'src/app/type';
import { PlaylistService } from 'src/app/playlist.service';
import { Apollo } from 'apollo-angular';
import { query } from '@angular/animations';
import gql from 'graphql-tag';

@Component({
  selector: 'app-list-playlist',
  templateUrl: './list-playlist.component.html',
  styleUrls: ['./list-playlist.component.scss']
})
export class ListPlaylistComponent implements OnInit {

  @Input() playlist: any

  @Input() video_id: number

  isExists: boolean = false;

  videos: Array<any>

  result: number

  date = new Date();

  constructor(private playlistService: PlaylistService, private apollo: Apollo) { }

  ngOnInit(): void { 
      
    this.videos = JSON.parse(this.playlist.videos);
    this.playlistService.videoObserve.subscribe(result => {     
      this.result = result;
      this.isExists = false
      this.videos.forEach((vid: Obj) => {
        if(vid.id == result){
          this.isExists = true;
        }
      })
    })   
  }

  updatePlaylist(){
  
    if(this.isExists == true){
        this.videos.forEach((vid: Obj, index) => {
          if(vid.id == this.result){
            this.videos.splice(index, 1);
          }
        })
    }else {
      let id: Obj = {
        id: this.result
      }

      this.videos.push(id);
    }

    this.apollo.mutate({
      mutation: this.playlistService.updateQuery,
      variables: {
        id: this.playlist.id,
        user_id: this.playlist.user_id,
        name: this.playlist.name,
        privacy: this.playlist.privacy,
        description: this.playlist.description,
        views: this.playlist.views,
        day: this.date.getDate(),
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear(),
        videos: JSON.stringify(this.videos)
      }
    }).subscribe(res => this.playlistService.videoBehaviour.next(this.result))
  }

}

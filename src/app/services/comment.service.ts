import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private apollo: Apollo) { }

  getAllComments(video_id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getAllComments($video_id: Int!) {
          getAllComments(video_id: $video_id){
            id
            user_id
            video_id
            likes
            dislikes
            description
            day
            month
            year
          }
        }
      `,
      variables : {
        video_id: video_id
      }
    })
  }
}

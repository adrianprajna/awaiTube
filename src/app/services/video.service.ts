import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private apollo: Apollo) { }

  getAllVideos(){
    return this.apollo.watchQuery<any>({
      query: gql`
      query getAllVideos {
        videos {
          id
          user_id
          title
          url
          description
          category
          location
          views
          day
          month
          year
          thumbnail
          likes
          dislikes
          age_restriction
          privacy
          premium
        }
      }
      `
    })
  }

  getVideo(video_id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getVideo($id: ID!) {
          getVideo(id: $id){
            id
            user_id
            title
            url
            description
            category
            location
            views
            day
            month
            year
            thumbnail
            likes
            dislikes
            age_restriction
            privacy
            premium
          }
        }
      `,
      variables: {
        id: video_id
      }
    })
  }
}

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

  createVideo(user_id: number, title: string, url: string, description: string, category: string, location: string, day: number, month: number, thumbnail: string, age_restriction: boolean, privacy: string, premium: boolean){
    return this.apollo.mutate({
      mutation: gql `
        mutation createVideo($user_id: Int!, $title: String!, $url: String!, $description: String!, $category: String!, $location: String!, $day: Int!, $month: Int!, $thumbnail: String!, $age_restriction: Boolean!, $privacy: String!, $premium: Boolean!){
          createVideo(input:{
            user_id: $user_id,
            title: $title,
            url: $url,
            description: $description,
            category: $category,
            location: $location,
            views: 0,
            day: $day,
            month: $month,
            year: 2020,
            thumbnail: $thumbnail,
            likes: 0,
            dislikes: 0,
            age_restriction: $age_restriction,
            privacy: $privacy,
            premium: $premium
          }){
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
        user_id: user_id,
        title: title,
        url: url,
        description: description,
        category: category,
        location: location,
        day: day,
        month: month,
        thumbnail: thumbnail,
        age_restriction: age_restriction,
        privacy: privacy,
        premium: premium
      },
    })
  }


}

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'apollo-link';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  videoBehaviour: BehaviorSubject<number> = new BehaviorSubject(0);
  videoObserve = this.videoBehaviour.asObservable()

  updateQuery = gql `
  mutation updatePlaylist($id: ID!, $user_id: Int!, $name: String!, $privacy: String!, $description: String!, $views: Int!, $day: Int!, $month: Int!, $year: Int!, $videos: String!){
    updatePlaylist(id: $id, input: {
      user_id: $user_id,
      name: $name,
      privacy: $privacy,
      description: $description,
      views: $views,
      day: $day,
      month: $month,
      year: $year,
      videos: $videos
    }) {
      id
      user_id
      name
      privacy
      description
      views
      day
      month
      year
      videos
    }
  }
`;

  constructor(private apollo: Apollo, private route: Router) { }

  getPlaylist(id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getPlaylist($id: ID!){
          playlist(id: $id){
            id
            user_id
            name
            privacy
            description
            views
            day
            month
            year
            videos
          }
        }
      `,
      variables: {
        id: id
      }
    })
  }

  createPlaylist(user_id: number, name: string, privacy: string, description: string){
    let date = new Date();

    return this.apollo.mutate({
      mutation: gql `
        mutation createPlaylist($user_id: Int!, $name: String!, $privacy: String!, $description: String!, $day: Int!, $month: Int!){
          createPlaylist(input: {
            user_id: $user_id,
            name: $name,
            privacy: $privacy,
            description: $description,
            views: 0,
            day: $day,
            month: $month,
            year: 2020,
            videos: "[]"
          }){
            id
            user_id
            name
            privacy
            description
            views
            day
            month
            year
            videos
          }
        }
      `,
      variables: {
        user_id: user_id,
        name: name,
        privacy: privacy,
        description: description,
        day: date.getDate(),
        month: date.getMonth() + 1
      }
    })
  }

  updatePlaylist(id: bigint, user_id: number, name: string, privacy: string, description: string, views: number, videos: string){
    let date = new Date();
  
    this.apollo.mutate({
      mutation: gql `
        mutation updatePlaylist($id: ID!, $user_id: Int!, $name: String!, $privacy: String!, $description: String!, $views: Int!, $day: Int!, $month: Int!, $year: Int!, $videos: String!){
          updatePlaylist(id: $id, input: {
            user_id: $user_id,
            name: $name,
            privacy: $privacy,
            description: $description,
            views: $views,
            day: $day,
            month: $month,
            year: $year,
            videos: $videos
          }) {
            id
            user_id
            name
            privacy
            description
            views
            day
            month
            year
            videos
          }
        }
      `,
      variables: {
        id: id,
        user_id: user_id,
        name: name,
        privacy: privacy,
        description: description,
        views: views,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        videos: videos
      },
      refetchQueries: [{
        query: gql `
          query getPlaylist($id: ID!){
            playlist(id: $id){
              user_id
              name
              privacy
              description
              views
              day
              month
              year
              videos
            }
          }
        `,
        variables: {
          id: id
        }
      }]
    }).subscribe(res => console.log(res.data))
  }

  deletePlaylist(id: number): void{
    this.apollo.mutate({
      mutation: gql `
        mutation deletePlaylist($id: ID!){
          deletePlaylist(id: $id)
        }
      `,
      variables: {
        id: id
      }
    }).subscribe(res => {
        this.route.navigate(['']);
    });
  }

  getAllPlaylists(name: string){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getAllPlaylist($name: String!){
          playlists(name: $name){
            id
            user_id
            name
            privacy
            description
            views
            day
            month
            year
            videos
          }
        }
      `,
      variables: {
        name: name
      }
    })
  }

  getAllUserPlaylist(user_id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getAllUserPlaylist($user_id: Int!){
          getAllUserPlaylist(user_id: $user_id){
            id
            user_id
            name
            privacy
            description
            views
            day
            month
            year
            videos
          }
        }
      `,
      variables: {
        user_id: user_id
      }
    })
  }
}

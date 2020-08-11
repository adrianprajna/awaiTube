import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ChannelService } from './channel.service';
import { User } from '../type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  updateUserQuery = gql `
    mutation updateUser($id: ID!, $name: String!, $email: String!, $img_url: String!, $premium: Boolean!, $subscribers: Int!, $liked_video: String!, $disliked_video: String!, $liked_comment: String!, $disliked_comment: String!, $subscribed_channel: String!, $playlists: String!, $liked_post: String!, $disliked_post: String!) {
      updateUser(id: $id, input: {
        name: $name,
        email: $email,
        img_url: $img_url,
        premium: $premium,
        subscribers: $subscribers,
        liked_video: $liked_video,
        disliked_video: $disliked_video,
        liked_comment: $liked_comment,
        disliked_comment: $disliked_comment,
        subscribed_channel: $subscribed_channel,
        playlists: $playlists,
        liked_post: $liked_post,
        disliked_post: $disliked_post
      }){
        id
        name
        email
        premium
        img_url
        subscribers
        liked_video
        disliked_video
        liked_comment
        disliked_comment
        subscribed_channel
        playlists
        liked_post
        disliked_post
      }
    }
  `;

  getUserByEmailQuery = gql `
      query getUserByEmail($email: String!){
        getUserByEmail(email: $email){
          id
          name
          email
          premium
          img_url
          subscribers
          liked_video
          disliked_video
          liked_comment
          disliked_comment
          subscribed_channel
          playlists
          liked_post
          disliked_post
        }
      }
  `;

  constructor(private apollo: Apollo, private channelService: ChannelService) { }

  user: User

  getUser(user_id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
      query getUser($id: ID!){
        getUser(id: $id){
          id
          name
          email
          premium
          img_url
          subscribers
          liked_video
          disliked_video
          liked_comment
          disliked_comment
          subscribed_channel
          playlists
          liked_post
          disliked_post
        }
      }
      `,
      variables: {
        id: user_id
      }
    })
  }

  getUserByEmail(email: string){
    return this.apollo.watchQuery<any>({
      query: this.getUserByEmailQuery,
      variables: {
        email: email
      }
    })
  }

  createUser(name: string, email: string, img_url: string){
    this.apollo.mutate({
      mutation: gql `
      mutation createUser($name: String!, $email: String!, $img_url: String!){
        createUser(input: {
          name: $name,
          email: $email,
          premium: false,
          subscribers: 0,
          img_url: $img_url,
          liked_video: "[]",
          disliked_video: "[]",
          liked_comment: "[]",
          disliked_comment: "[]",
          subscribed_channel: "[]",
          playlists: "[]",
          liked_post: "[]",
          disliked_post: "[]"
        }) {
          id
          name
          email
          premium
          img_url
          subscribers
          liked_video
          disliked_video
          liked_comment
          disliked_comment
          subscribed_channel
          playlists
          liked_post
          disliked_post
        }
      }
      `,
      variables: {
        name: name,
        email: email,
        img_url: img_url
      }
    }).subscribe((result: any) => {
      this.user = result.data.createUser; 
      let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let date = new Date();
      let join_date = `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
      this.channelService.createChannel(this.user.id, 'no background', 'this is a description', join_date, '[]')
    })
  }

  getAllUsers(name: string){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getAllUsers($name: String!) {
          getAllUsers(name: $name){
            id
            name
            email
            premium
            img_url
            subscribers
            liked_video
            disliked_video
            liked_comment
            disliked_comment
            subscribed_channel
            playlists
            liked_post
            disliked_post
          }
        }
      `,
      variables: {
        name: name
      }
    })
  }

  getMembership(user_id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getMembership($user_id: Int!){
          membership(user_id: $user_id){
            id
            user_id
            plan
            date
          }
        }
      `,
      variables: {
        user_id: user_id
      }
    })
  }

  createMembership(user_id: number, plan: string, date: string){
    return this.apollo.mutate({
      mutation: gql `
        mutation createMembership($user_id: Int!, $plan: String!, $date: String!){
          createMembership(input: {
            user_id: $user_id,
            plan: $plan,
            date: $date
          }){
            id
            user_id
            plan
            date
          }
        }
      `,
      variables: {
        user_id: user_id,
        plan: plan,
        date: date
      },
      refetchQueries: [{
        query: gql `
        query getMembership($user_id: Int!){
          membership(user_id: $user_id){
            id
            user_id
            plan
            date
          }
        }
        `,
        variables: {
          user_id: user_id
        }
      }]
    })
  }

}

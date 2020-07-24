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
    mutation updateUser($id: ID!, $name: String!, $email: String!, $img_url: String!, $premium: Boolean!, $subscribers: Int!, $liked_video: String!, $disliked_video: String!, $liked_comment: String!, $disliked_comment: String!, $subscribed_channel: String!) {
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
        subscribed_channel: $subscribed_channel
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
          subscribed_channel: "[]"
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
      this.channelService.createChannel(this.user.id, this.user.img_url, 'this is a description', join_date, 'this is a link')
    })
  }

}

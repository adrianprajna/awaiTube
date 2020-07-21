import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  updateUserQuery = gql `
    mutation updateUser($id: ID!, $name: String!, $email: String!, $img_url: String!, $premium: Boolean!, $subscribers: Int!, $liked_video: String!, $disliked_video: String!, $liked_comment: String!, $disliked_comment: String!) {
      updateUser(id: $id, input: {
        name: $name,
        email: $email,
        img_url: $img_url,
        premium: $premium,
        subscribers: $subscribers,
        liked_video: $liked_video,
        disliked_video: $disliked_video,
        liked_comment: $liked_comment,
        disliked_comment: $disliked_comment
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
        }
      }
  `;

  constructor(private apollo: Apollo) { }

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
          disliked_comment: "[]"
        }) {
          id
          name
          email
          premium
          img_url
          subscribers
          liked_video
          disliked_video,
          liked_comment,
          disliked_comment
        }
      }
      `,
      variables: {
        name: name,
        email: email,
        img_url: img_url
      }
    }).subscribe(result => console.log(result))
  }

}

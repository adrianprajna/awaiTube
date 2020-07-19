import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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
      query: gql `
      query getUserByEmail($email: String!){
        getUserByEmail(email: $email){
          id
          name
          email
          premium
          img_url
          subscribers
        }
      }
      `,
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
          img_url: $img_url
        }) {
          id
          name
          email
          premium
          img_url
          subscribers
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

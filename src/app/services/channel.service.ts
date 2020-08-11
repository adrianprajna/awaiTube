import {
  Injectable
} from '@angular/core';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private apollo: Apollo) {}

  updateChannelQuery = gql `
  mutation updateChannel($id: ID!, $user_id: Int!, $background_url: String!, $description: String!, $join_date: String!, $links: String!) {
    updateChannel(id: $id, input: {
      user_id: $user_id,
      background_url: $background_url,
      description: $description,
      join_date: $join_date,
      links: $links
    }) {
      id
      user_id
      background_url
      description
      join_date
      links
    }
  }
  `;

  updatePostQuery = gql `
    mutation updatePost($id: ID!, $channel_id: Int!, $description: String!, $picture: String!, $date: String!, $likes: Int!, $dislikes: Int!, $title: String!) {
      updatePost(id: $id, input: {
        channel_id: $channel_id,
        description: $description,
        picture: $picture,
        date: $date,
        likes: $likes,
        dislikes: $dislikes,
        title: $title
      }){
        id
        channel_id
        description
        picture
        date
        likes
        dislikes
        title
      }
    }
  `;

  getPostQuery = gql `
    query getPost($id: ID!){
      post(id: $id){
        channel_id
        description
        picture
        date
        likes
        dislikes
        title
      }
    }
  `;
  getChannel(id: number) {
    return this.apollo.watchQuery < any > ({
      query: gql `
        query getChannel($id: ID!){
          channel(id: $id){
            user_id
            background_url
            description
            join_date
            links
          }
        }
      `,
      variables: {
        id: id
      }
    })
  }

  createChannel(user_id: bigint, background_url: string, description: string, join_date: string, links: string) {
    this.apollo.mutate({
      mutation: gql `
        mutation createChannel($user_id: Int!, $background_url: String!, $description: String!, $join_date: String!, $links: String!){
          createChannel(input: {
            user_id: $user_id,
            background_url: $background_url,
            description: $description,
            join_date: $join_date,
            links: $links
          }){
            id
            user_id
            background_url
            description
            join_date
            links
          }
        }
      `,
      variables: {
        user_id: user_id,
        background_url: background_url,
        description: description,
        join_date: join_date,
        links: links
      }
    }).subscribe(result => window.location.reload());
  }

  updateChannel(id: number, channel: any){
    return this.apollo.mutate({
      mutation: gql `
        mutation updateChannel($id: ID!, $user_id: Int!, $background_url: String!, $description: String!, $join_date: String!, $links: String!) {
          updateChannel(id: $id, input: {
            user_id: $user_id,
            background_url: $background_url,
            description: $description,
            join_date: $join_date,
            links: $links
          }) {
            id
            user_id
            background_url
            description
            join_date
            links
          }
        }
      `,
      variables: {
        id: id,
        user_id: channel.user_id,
        background_url: channel.background_url,
        description: channel.description,
        join_date: channel.join_date,
        links: channel.join_date
      },
      refetchQueries: [{
        query: gql `
          query getChannel($id: ID!){
            channel(id: $id){
              user_id
              background_url
              description
              join_date
              links
            }
          }
        `,
        variables: {
          id: id
        }
      }]
    })
  }

  getChannelByUser(user_id: number) {
    return this.apollo.watchQuery < any > ({
      query: gql `
        query getChannelByUser($user_id: Int!) {
          getChannelByUser(user_id: $user_id){
            id
            user_id
            background_url
            description
            join_date
            links
          }
        }
      `,
      variables: {
        user_id: user_id
      }
    })
  }

  getAllPosts(channel_id: number){
    return this.apollo.watchQuery<any>({
      query: gql `
        query getAllPosts($channel_id: Int!) {
          posts(channel_id: $channel_id){
            id
            channel_id
            description
            picture
            date
            likes
            dislikes
            title
          }
        }
      `,
      variables: {
        channel_id: channel_id
      }
    })
  }

  addPost(channel_id: number, description: string, picture: string, date: string, title: string){
    this.apollo.mutate({
      mutation: gql `
        mutation createPost($channel_id: Int!, $description: String!, $picture: String!, $date: String!, $title: String!){
          createPost(input: {
            channel_id: $channel_id,
            description: $description,
            picture: $picture,
            date: $date,
            likes: 0,
            dislikes: 0
            title: $title
          }){
            id
            channel_id
            description
            picture
            date
            likes
            dislikes
            title
          }
        }
      `,
      variables: {
        channel_id: channel_id,
        description: description,
        picture: picture,
        date: date,
        title: title
      },
      refetchQueries: [{
        query: gql `
          query getAllPosts($channel_id: Int!) {
            posts(channel_id: $channel_id){
              id
              channel_id
              description
              picture
              date
              likes
              dislikes
              title
            }
          }
        `,
        variables: {
          channel_id: channel_id
        }
      }]
    }).subscribe(result => {
      this.createNotification(channel_id, title, "no thumbnail");
    })
  }

  getAllNotifications(){
    return this.apollo.watchQuery<any>({
        query: gql `
          query getAllNotifications {
            notifications {
              id
              channel_id
              title
              thumbnail
            }
          }
        `
    })
  }

  createNotification(channel_id: number, title: string, thumbnail: string){
    this.apollo.mutate({
      mutation: gql `
        mutation createNotification($channel_id: Int!, $title: String!, $thumbnail: String!) {
          createNotification(input: {
            channel_id: $channel_id,
            title: $title,
            thumbnail: $thumbnail
          }) {
            id
            channel_id
            title
            thumbnail
          }
        }
      `,
      variables: {
        channel_id: channel_id,
        title: title,
        thumbnail: thumbnail
      },
      refetchQueries: [{
        query: gql `
        query getAllNotifications {
          notifications {
            id
            channel_id
            title
            thumbnail
          }
        }
        `
      }]
    }).subscribe()
  }
  
}

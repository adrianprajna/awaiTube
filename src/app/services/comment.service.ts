import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  getCommentQuery = gql `
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
        time
      }
    }
  `;

  constructor(private apollo: Apollo) { }

  getAllComments(video_id: number){
    return this.apollo.watchQuery<any>({
      query: this.getCommentQuery,
      variables : {
        video_id: video_id
      }
    })
  }

  createComment(user_id: number, video_id: number, description: string, day: number, month: number, time: string){
    this.apollo.mutate({
      mutation: gql `
        mutation createComment ($user_id: Int!, $video_id: Int!, $description: String!, $day: Int!, $month: Int!, $time: String!){
          createComment(input: {
              user_id: $user_id,
              video_id: $video_id,
              likes: 0,
              dislikes: 0,
              description: $description,
              day: $day,
              month: $month,
              year: 2020,
              time: $time
          }){
            id
            user_id
            video_id
            likes
            dislikes
            description
            day
            month
            year
            time
          }
        }
      `,
      variables : {
        user_id: user_id,
        video_id: video_id,
        description: description,
        day: day,
        month: month,
        time: time
      },
      refetchQueries: [{
        query: this.getCommentQuery,
        variables: {
          repoFullName: 'apollographql/apollo-client',
          video_id: video_id
        },
      }],
    }).subscribe(result => console.log(result.data));

  }

    getAllReplies(comment_id: number){
      return this.apollo.watchQuery<any>({
        query: gql `
          query getAllReplies($comment_id: ID!){
            replies(comment_id: $comment_id){
              id
              comment_id
              user_id
              likes
              dislikes
              description
              day
              month
              year
            }
          }
        `,
        variables: {
          comment_id: comment_id
        }
      })
    }


    createReply(comment_id: number, user_id: number, description: string, day: number, month: number){
      this.apollo.mutate({
        mutation: gql `
          mutation createReply ($comment_id: Int!, $user_id: Int!, $description: String!, $day: Int!, $month: Int!){
            createReply(input: {
              comment_id: $comment_id,
              user_id: $user_id,
              likes: 0,
              dislikes: 0,
              description: $description,
              day: $day,
              month: $month,
              year: 2020
            }){
              id
              comment_id
              user_id
              likes
              dislikes
              description
              day
              month
              year
            }
          }
        `,
        variables: {
          comment_id: comment_id,
          user_id: user_id,
          description: description,
          day: day,
          month: month
        },
        refetchQueries: [{
          query: gql `
            query getAllReplies($comment_id: ID!){
              replies(comment_id: $comment_id){
                id
                comment_id
                user_id
                likes
                dislikes
                description
                day
                month
                year
              }
            }
          `,
          variables: {
            comment_id: comment_id
          }
        }]
      }).subscribe(result => console.log(result.data));
    }


}

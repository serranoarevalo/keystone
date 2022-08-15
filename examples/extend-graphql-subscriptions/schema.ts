import { list, graphQLSchemaExtension } from '@keystone-6/core';
import { select, relationship, text, timestamp, password, checkbox } from '@keystone-6/core/fields';
import { pubSub } from './websocket';

import type { Lists } from '.keystone/types';

export const lists: Lists = {
  Post: list({
    access: {
      operation: {
        // TODO: This access control does not affect the subscription
        query: ({ session }) => !!session.data.isAdmin,
        update: ({ session }) => !!session.data.isAdmin,
      },
    },
    hooks: {
      afterOperation: async ({ item }) => {
        // publish the new post to the 'POST_UPDATED' channel after it is updated/created
        // TODO: This bypasses the access control for the subscription
        pubSub.publish('POST_UPDATED', {
          postUpdated: item,
        });
      },
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
        ],
      }),
      content: text(),
      publishDate: timestamp(),
      author: relationship({ ref: 'Author.posts', many: false }),
    },
  }),

  Author: list({
    access: {
      operation: {
        query: ({ session }) => !!session.data.isAdmin,
        update: ({ session }) => !!session.data.isAdmin,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.author', many: true }),
      password: password(),
      isAdmin: checkbox(),
    },
  }),
};

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: `
    type Mutation {
      """ Publish a post """
      publishPost(id: ID!): Post
    }

    type Time {
      iso: String!
    }

    type Subscription {
      postPublished: Post
      postUpdated: Post
      time: Time
    }`,

  resolvers: {
    Mutation: {
      // A Custome Mutation to publish a post
      publishPost: async (root, { id }, context) => {
        // we use `context.db.Post`, not `context.query.Post`
        //   as this matches the type needed for GraphQL resolvers
        const post = context.db.Post.updateOne({
          where: { id },
          data: { status: 'published', publishDate: new Date().toISOString() },
        });

        console.log('POST_PUBLISHED', { id });
        // TODO: This bypasses the access control for the subscription
        pubSub.publish('POST_PUBLISHED', {
          postPublished: post,
        });

        return post;
      },
    },

    // add the subscription resolvers
    Subscription: {
      time: {
        // @ts-ignore
        subscribe: () => pubSub.asyncIterator(['TIME']),
      },
      postUpdated: {
        // @ts-ignore
        subscribe: () => pubSub.asyncIterator(['POST_UPDATED']),
      },
      postPublished: {
        // @ts-ignore
        subscribe: () => pubSub.asyncIterator(['POST_PUBLISHED']),
      },
    },
  },
});

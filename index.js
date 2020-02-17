const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

const Post = require("./models/Post");
const { MONGODB } = require("./config");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  input PostInput {
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
    getPost(id: String): Post
  }

  type Mutation {
    createPost(post: PostInput): Post
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost(parent, args) {
      try {
        const post = Post.findById(args.id, (err, res) => {
          if (err) console.log(`Heres the error ${err}`);
          console.log(res);
        });
        return post;
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Mutation: {
    createPost(_, args) {
      const post = new Post({
        body: args.post.body,
        username: args.post.username,
        createdAt: args.post.createdAt
      });
      post.save();
      return post;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: 5000 });
  })
  .then(value => console.log(value.url))
  .catch(err => console.log(err));

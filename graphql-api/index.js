const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }
  type Query {
    users: [User!]
  }
  type Mutation {
    createUser(name: String!): User!
  }
`;

let users = [{ id: 1, name: "Alice" }];

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    createUser: (_, { name }) => {
      const newUser = { id: users.length + 1, name };
      users.push(newUser);
      return newUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`GraphQL API en ${url}`));
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    message: String!
    token: String
    user: User
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  type Query {
    hello: String!
    login(data: LoginInput!): AuthPayload!
  }

  type Mutation {
    signup(data: SignupInput!): AuthPayload!
  }
`;

module.exports = { typeDefs };
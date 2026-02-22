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

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    department: String!
    salary: Float!
    date_of_joining: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    department: String!
    salary: Float!
    date_of_joining: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    department: String
    salary: Float
    date_of_joining: String
    employee_photo: String
  }

  type UploadPhotoResponse {
    message: String!
    url: String!
    public_id: String!
  }

  type Query {
    login(data: LoginInput!): AuthPayload!
    getAllEmployees: [Employee!]!
    getEmployeeById(id: ID!): Employee
    searchEmployeesByDesignationOrDepartment(
      designation: String
      department: String
    ): [Employee!]!
  }

  type Mutation {
    signup(data: SignupInput!): AuthPayload!
    addEmployee(data: AddEmployeeInput!): Employee!
    updateEmployee(id: ID!, data: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    uploadEmployeePhoto(base64: String!): UploadPhotoResponse!
  }
`;

module.exports = { typeDefs };
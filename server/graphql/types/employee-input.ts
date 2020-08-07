import { gql } from 'apollo-server-koa'

export const EmployeeInput = gql`
  input EmployeeInput {
    id: String
    name: String
    age: Int
    email: String
    department: String
  }
`

import { gql } from 'apollo-server-koa'

export const Employee = gql`
  type Employee {
    id: String
    name: String
    age: Int
    email: String
    department: String
  }
`

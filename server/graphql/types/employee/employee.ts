import { gql } from 'apollo-server-koa'

export const Employee = gql`
  # enum OrderByInput {
  #   name_ASC
  #   name_DESC
  #   age_ASC
  #   age_DESC
  # }

  type Employee {
    id: String
    name: String
    age: Int
    email: String
    departmant: String
    company: Company
  }
`

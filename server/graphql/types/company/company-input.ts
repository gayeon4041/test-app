import { gql } from 'apollo-server-koa'

export const CompanyInput = gql`
  input CompanyInput {
    name: String!
    description: String
    toLowerName: String
  }
`

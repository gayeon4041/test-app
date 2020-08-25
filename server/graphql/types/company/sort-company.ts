import { gql } from 'apollo-server-koa'

export const SortCompany = gql`
  input SortCompany {
    name: String
    description: String
    createdAt: String
  }
`

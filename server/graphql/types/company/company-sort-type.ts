import { gql } from 'apollo-server-koa'

export const CompanySortDirection = gql`
  enum CompanySortDirection {
    ASC
    DESC
  }
`

export const CompanySortType = gql`
  input CompanySortType {
    name: CompanySortDirection
    createdAt: CompanySortDirection
    toLowerName: CompanySortDirection
  }
`

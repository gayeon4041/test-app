import { gql } from 'apollo-server-koa'

export const EmployeesSortDirection = gql`
  enum EmployeesSortDirection {
    ASC
    DESC
  }
`

export const EmployeeSortType = gql`
  input EmployeeSortType {
    name: EmployeesSortDirection
    age: EmployeesSortDirection
  }
`

import { gql } from 'apollo-server-koa'

export const Company = gql`
  type Company {
    id: String
    name: String
    description: String
    toLowerName: String
    employees(name: String, sortOption: EmployeeSortType): [Employee]
    createdAt: String
    updatedAt: String
  }
`

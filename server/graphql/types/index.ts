import { Filter, Pagination, Sorting, ObjectRef } from '@things-factory/shell'
import { Employee } from './employee'
import { EmployeeInput } from './employee-input'
// import * as CommonCode from './common-code'
// import * as CommonCodeDetail from './common-code-detail'

// export const queries = [
//   CommonCode.Query,
//   CommonCodeDetail.Query
// ]

// export const mutations = [
//   CommonCode.Mutation,
//   CommonCodeDetail.Mutation
// ]

// export const types = [
//   ...CommonCode.Types,
//   ...CommonCodeDetail.Types
// ]

export const queries = [
  /* GraphQL */ `
  employees(name: String): [Employee]
`
]

export const mutations = [
  /* GraphQL */ `
  createOrUpdateEmployee(employee: EmployeeInput): Employee
  deleteEmployee(id: String): Employee
`
]

export const types = [Filter, Pagination, Sorting, ObjectRef, Employee, EmployeeInput]

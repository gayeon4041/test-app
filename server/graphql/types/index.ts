import { Company } from './company/company'
import { CompanyInput } from './company/company-input'
import { Employee } from './employee/employee'
import { EmployeeInput } from './employee/employee-input'
// -------------------------------------------------

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

// ------------------------------------------
export const queries = [
  /* GraphQL */ `
  employees(ids:[String], name: String): [Employee]
  companies(id: String, name: String, sortOption: String): [Company]
  `
]

export const mutations = [
  /* GraphQL */ `
  createOrUpdateEmployee(employee: EmployeeInput): Employee
  deleteEmployee(ids: [String]): [Employee]
  createCompany(company: CompanyInput): Company
  `
]

export const types = [Company, CompanyInput, Employee, EmployeeInput]

// import * as CommonCode from './common-code'
// import * as CommonCodeDetail from './common-code-detail'
//
// export const queries = [
//   CommonCode.Query,
//   CommonCodeDetail.Query
// ]

// export const mutations = [
//   CommonCode.Mutation,
//   CommonCodeDetail.Mutation
// ]

import { employeesResolver } from './employee/employees'
import { createOrUpdateEmployeeResolver } from './employee/create-or-update-employee'
import { deleteEmployeeResolver } from './employee/delete-employee'
import { companyResolver } from './company/company'
import { companySubQuery } from './company/company-sub-query'
import { employeesSubQuery } from './employee/employees-sub-query'
import { createCompanyResolver } from './company/create-company'

export const queries = [employeesResolver, companyResolver, companySubQuery, employeesSubQuery]

export const mutations = [createOrUpdateEmployeeResolver, deleteEmployeeResolver, createCompanyResolver]

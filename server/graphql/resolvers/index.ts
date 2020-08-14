import { companyResolver } from './company'
import { companySubQuery } from './company-sub-query'
import { createOrUpdateEmployeeResolver } from './create-or-update-employee'
import { deleteEmployeeResolver } from './delete-employee'
import { employeesResolver } from './employees'
import { employeesSubQuery } from './employees-sub-query'

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

export const queries = [employeesResolver, companyResolver, companySubQuery, employeesSubQuery]

export const mutations = [createOrUpdateEmployeeResolver, deleteEmployeeResolver]

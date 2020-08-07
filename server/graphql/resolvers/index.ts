import { employeesResolver } from './employees'
import { createOrUpdateEmployeeResolver } from './create-or-update-employee'
import { deleteEmployeeResolver } from './delete-employee'
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

export const queries = [employeesResolver]

export const mutations = [createOrUpdateEmployeeResolver, deleteEmployeeResolver]

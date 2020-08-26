import { Employee } from '../../../entities'
import { employeesSubQuery } from './employees-sub-query'

export const sortEmployeesResolver = {
  async sortEmployees(_: any, { sortOption }: { sortOption?: Record<string, any> }) {
    let sortCondition

    sortCondition = {
      ...sortCondition,
      order: {
        ...sortOption
      }
    }

    return await Employee.find(sortCondition)
  }
}

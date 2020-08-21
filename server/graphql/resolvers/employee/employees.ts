import { Employee, Company } from '../../../entities'
import { employeesSubQuery } from './employees-sub-query'
import { Like, FindManyOptions, FindOneOptions } from 'typeorm'

export const employeesResolver = {
  async employees(_: any, { ids, name }: Record<string, any>) {
    let findCondition
    if (name) {
      findCondition = { name: Like(`%${name}%`) }
    }

    if (ids) {
      return await Employee.findByIds(ids)
    }

    let result = await Employee.find(findCondition)
    return result
  }
}

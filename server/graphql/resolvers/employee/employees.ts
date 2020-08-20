import { Employee } from '../../../entities'
import { employeesSubQuery } from './employees-sub-query'
import { Like } from 'typeorm'

export const employeesResolver = {
  async employees(_: any, { name }: Record<string, any>) {
    let findCondition

    if (name) {
      findCondition = { name: Like(`%${name}%`) }
    }

    let result = await Employee.find(findCondition)
    return result
  }
}

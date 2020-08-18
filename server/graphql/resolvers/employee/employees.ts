import { Employee } from '../../../entities'

export const employeesResolver = {
  async employees(_: any, { name }: Record<string, any>) {
    let findCondition

    if (name) {
      findCondition = { name }
    }

    let result = await Employee.find(findCondition)
    return result
  }
}

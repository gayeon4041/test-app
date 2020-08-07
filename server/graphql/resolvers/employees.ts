import { Employee } from '../../entities'

export const employeesResolver = {
  async employees(_: any, { name }: Record<string, any>) {
    let findCodition

    if (name) {
      findCodition = { name }
    }
    let result = await Employee.find(findCodition)
    return result
  }
}

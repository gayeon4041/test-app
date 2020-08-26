import { Company, Employee } from '../../../entities'
import { Like } from 'typeorm'

export const companySubQuery = {
  Company: {
    async employees(company: Company, { name, sortOption }: Record<string, any>) {
      let findCondition: Record<string, any> = { company }
      console.log(findCondition)
      if (name) {
        findCondition.name = Like(`%${name}%`)
        console.log(findCondition)
      }

      if (sortOption) {
        findCondition.order = { ...sortOption }
      }

      return await Employee.find(findCondition)
    }
  }
}

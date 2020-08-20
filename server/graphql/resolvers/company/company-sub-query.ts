import { Company, Employee } from '../../../entities'
import { Like } from 'typeorm'

export const companySubQuery = {
  Company: {
    async employees(company: Company, { name }: Record<string, any>) {
      let findCondition: Record<string, any> = { company }

      if (name) {
        findCondition.name = Like(`%${name}%`)
      }

      return await Employee.find(findCondition)
    }
  }
}

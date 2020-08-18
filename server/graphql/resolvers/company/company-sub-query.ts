import { Company, Employee } from '../../../entities'

export const companySubQuery = {
  Company: {
    async employees(company: Company) {
      return await Employee.find({ where: { company } })
    }
  }
}

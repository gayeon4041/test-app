import { Company, Employee } from '../../entities'

export const companySubQuery = {
  Company: {
    employees: async (company: Company) => {
      return await Employee.find({ where: { company } })
    }
  }
}

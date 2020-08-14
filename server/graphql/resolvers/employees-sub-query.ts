import { Employee, Company } from '../../entities'

export const employeesSubQuery = {
  Employee: {
    company: async (employee: Employee) => {
      return await Company.findOne(employee.companyId)
    }
  }
}

import { Employee, Company } from '../../../entities'

export const employeesSubQuery = {
  Employee: {
    async company(employee: Employee) {
      if (employee.companyId) return await Company.findOne(employee.companyId)
    }
  }
}

import { Company, Employee } from '../../../entities'
import { Like } from 'typeorm'
import { EmployeesSortDirection } from 'server/graphql/types/employee/employee-sort-type'
import { employeesSubQuery } from '../employee/employees-sub-query'

export const companySubQuery = {
  Company: {
    async employees(company: Company, { name, sortOption }: Record<string, any>) {
      let findCondition: Record<string, any> = {
        where: { company }
      }

      if (name) {
        findCondition.where.name = Like(`%${name}%`)
      }

      if (sortOption) {
        findCondition.order = { ...sortOption }
      }

      return await Employee.find(findCondition)
    }
  }
}

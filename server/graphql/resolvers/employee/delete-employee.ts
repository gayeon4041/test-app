import { Employee } from '../../../entities'

export const deleteEmployeeResolver = {
  async deleteEmployee(_: any, { ids }: { ids: string[] }) {
    let employees: Employee[] = await Employee.findByIds(ids)

    return await Employee.remove(employees)
  }
}

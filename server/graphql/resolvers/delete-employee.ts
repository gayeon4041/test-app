import { Employee } from '../../entities'

export const deleteEmployeeResolver = {
  async deleteEmployee(_: any, { id }: { id: string }) {
    let employee: Employee = await Employee.findOne(id)

    return await employee.remove()
  }
}

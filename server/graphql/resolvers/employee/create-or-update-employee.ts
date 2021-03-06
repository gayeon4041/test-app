import { Employee } from '../../../entities'

export const createOrUpdateEmployeeResolver = {
  async createOrUpdateEmployee(_: any, { employee }: { employee: Partial<Employee> }) {
    const { id, companyId } = employee

    let updateUser
    if (id) {
      // update employee
      updateUser = await Employee.findOne(id)
    } else {
      // create employee
      updateUser = new Employee()
      updateUser.companyId = companyId
    }

    Object.assign(updateUser, employee)
    return await updateUser.save()
  }
}

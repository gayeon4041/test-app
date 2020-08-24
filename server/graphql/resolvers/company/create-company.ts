import { Company } from '../../../entities'

export const createCompanyResolver = {
  async createCompany(_: any, { company }: { company: Partial<Company> }) {
    let updateCompany

    // create employee
    updateCompany = new Company()

    Object.assign(updateCompany, company)
    return await updateCompany.save()
  }
}

import { Company } from '../../../entities'

export const createCompanyResolver = {
  async createCompany(_: any, { company }: { company: Partial<Company> }) {
    const { toLowerName } = company
    let updateCompany

    // create employee
    updateCompany = new Company()

    updateCompany.toLowerName = toLowerName

    Object.assign(updateCompany, company)
    return await updateCompany.save()
  }
}

import { Company } from '../../../entities'

export const companyResolver = {
  async companies(_: any, { id }: { id?: string }) {
    if (!id) return await Company.find()
    return await Company.findByIds([id])
  }
}

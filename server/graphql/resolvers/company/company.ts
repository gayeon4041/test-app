import { Company } from '../../../entities'

export const companyResolver = {
  async companies(_: any, { id, name }: { id?: string; name?: string }) {
    if (id) {
      return await Company.findByIds([id])
    }

    if (name) {
      return await Company.find({ name })
    }

    return await Company.find()
  }
}

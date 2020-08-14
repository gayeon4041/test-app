import { Company, Employee } from '../../entities'

export const companyResolver = {
  async companies() {
    return await Company.find()
  }
}

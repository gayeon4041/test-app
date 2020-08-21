import { Company } from '../../../entities'
import { Like } from 'typeorm'

export const companyResolver = {
  async companies(_: any, { id, name, sortOption }: { id?: string; name?: string; sortOption?: string }) {
    const findCondition: Record<string, any> = {}
    let whereCondition

    if (id) {
      return await Company.findByIds([id])
    }

    if (name) {
      whereCondition = {
        ...whereCondition,
        name: Like(`${name}%`)
      }
    }

    if (whereCondition) {
      findCondition.where = whereCondition
    }

    if (sortOption) {
      findCondition.order = { name: sortOption }
    }

    return await Company.find(findCondition)
  }
}

// order: { name: 'ASC' }

import { Company } from '../../../entities'
import { Like } from 'typeorm'

export const companyResolver = {
  async companies(
    _: any,
    { id, name, sortOption }: { id?: string; name?: string; sortOption?: Record<string, any>; 
  ) {
    const findCondition: Record<string, any> = {}
    let whereCondition

    if (id) {
      return await Company.findByIds([id])
    }

    // sortOption: {name: direction}[]
    // sortOption: {key: string, direction: 'ASC'|'DESC' }[]

    // [{
    //   createdAt: 'ASC'
    // }, {
    //   name: 'DESC'
    // }]

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
      
      findCondition.order = [{ createdAt: sortOption }, { name: sortOption }]
    }

    return await Company.find(findCondition)
  }
}

// order: { name: 'ASC' }

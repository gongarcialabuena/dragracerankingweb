import { queenApiClient } from '../client/queen/queenApiClient'

export const queenService = {
  async listQueens(seasonSelected, page) {
    const queenData = await queenApiClient.get(seasonSelected, page)
    return queenData
  },

  async createQueen(name, seasonId, image_Url) {
    if (!name?.trim()) {
      throw new Error('Name is required')
    } else if(!seasonId?.trim()){
      throw new Error('Season is required')
    } else if(!image_Url?.trim()){
      throw new Error('Image is required')
    }
    return await queenApiClient.create({name, seasonId, image_Url})
  },

  async deleteQueen(id) {
    if (!id) throw new Error('ID required')

    return await queenApiClient.remove(id)
  },

  async existsQueen(queenName){
    if (!queenName) throw new Error('Queen`s name required')
    return await queenApiClient.existsQueen(queenName)
  }
  
}
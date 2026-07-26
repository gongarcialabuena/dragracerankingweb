import { dropboxApiClient } from '../client/dropbox/dropboxApiClient'

export const dropboxService = {
  async getQueenImg(queen, season) {
    return await dropboxApiClient.getQueenImg(queen, season)
  }

}
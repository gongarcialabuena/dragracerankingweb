import { pointtypeApiClient } from '../client/episode/pointtypeApiClient'

export const pointTypeService = {
    async getPointTypes() {
        return await pointtypeApiClient.getAll()
    },
}
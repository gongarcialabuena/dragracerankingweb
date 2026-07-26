import { participateApiClient } from '../client/participate/participateApiClient'

export const participateService = {
    async addParticipation(queenId, seasonId, image_url){
        if (!queenId?.trim()) {
            throw new Error('Name is required')
        } else if(!seasonId?.trim()){
            throw new Error('Season is required')
        } else if(!image_url?.trim()){
            throw new Error('Image is required')
        }

        return await participateApiClient.create({queenId, seasonId, image_url})
    },

    async deleteParticipation(queenId, seasonId){
        if (!queenId?.trim()) {
            throw new Error('Name is required')
        } else if(!seasonId?.trim()){
            throw new Error('Season is required')
        }

        return await participateApiClient.delete({queenId, seasonId})
    }
}
import { ppeApiClient } from '../client/ppe/ppeApiClient'

export const ppeService = {
    async saveRanking(season_id, rows) {
        return await ppeApiClient.saveRanking({season_id, rows});
    },
    
    async getRanking(season){
        return await ppeApiClient.getRanking(season.id)
    },

    async publishRanking(season){
        return await ppeApiClient.publishRanking(season.id)
    }
}
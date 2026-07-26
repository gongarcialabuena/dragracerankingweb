import { ppeApiClient } from '../client/ppe/ppeApiClient'

export const ppeService = {
    async saveRanking(rows, rowsToDelete) {
        if(await ppeApiClient.deleteRowsRanking(rowsToDelete)){
            return await ppeApiClient.saveRanking(rows)
        }
        return false;
    },
    
    async getRanking(clientId, seasonId){
        return await ppeApiClient.getRanking(clientId, seasonId)
    }
}
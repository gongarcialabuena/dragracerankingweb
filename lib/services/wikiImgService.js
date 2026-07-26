import { wikiImgAPIClient } from '../client/supabase_storage/wikiImg/wikiImgAPIClient'

export const wikiImgService = {
    async getQueenImgWiki(name, season) {
        if (!season.franchise?.trim()) {
            throw new Error('Franchise for the queen`s season is required')
        } else if (!name?.trim()) {
            throw new Error('Name for the queen is required')
        }
        return await wikiImgAPIClient.getImgWiki(season.franchise, name)
    }
}
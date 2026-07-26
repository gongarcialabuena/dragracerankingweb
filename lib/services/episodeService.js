import { episodeApiClient } from '../client/episode/episodeApiClient'

export const episodeService = {
    async createEpisode(seasonId, title ) {
        if (!seasonId?.trim()) {
            throw new Error('Season for the episode is required')
        } else if (!title?.trim()) {
            throw new Error('Title for the episode is required')
        }

        return await episodeApiClient.create({seasonId, title})
    },

    async getEpisodes(seasonId) {
        if (!seasonId?.trim()) {
            throw new Error('Season for the episode is required')
        }
        return await episodeApiClient.get(seasonId)
    },

    async deleteLastEpisode(seasonId) {
        if (!seasonId?.trim()) {
            throw new Error('Season for the episode is required')
        }
        return await episodeApiClient.deleteLast(seasonId)
    }
}
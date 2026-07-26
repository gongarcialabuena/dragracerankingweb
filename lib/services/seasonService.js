import { seasonApiClient } from '../client/season/seasonApiClient'

export const seasonService = {
    async createSeason(name,franchise,year) {
        if (!name?.trim()) {
            throw new Error('Name for the season is required')
        } else if (!franchise?.trim()) {
            throw new Error('Franchise for the season is required')
        } else if (!year?.trim()) {
            throw new Error('Year for the season is required')
        }

        return await seasonApiClient.create({name,franchise,year})
    },

    async getAllSeasons() {
        return await seasonApiClient.getAllSeasons()
    }
}
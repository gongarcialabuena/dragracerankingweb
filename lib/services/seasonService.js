import { seasonApiClient } from '../client/season/seasonApiClient'
import { episodeService } from '@/lib/services/episodeService'

export const seasonService = {
    async createSeason(name,franchise,year) {
        if (!name?.trim()) {
            throw new Error('Name for the season is required')
        } else if (!franchise?.trim()) {
            throw new Error('Franchise for the season is required')
        } else if (!Number(year)) {
            throw new Error('Year for the season is required')
        }

        return await seasonApiClient.create({name,franchise,year})
    },

    async getRankableSeasons() {
        return await seasonApiClient.getRankableSeasons()
    },

    async getSeasonsWithEpisodes() {
        const seasons = await this.getAllSeasons()

        const entries = await Promise.all(
            seasons.map(async (season) => {
                const episodes = await episodeService.getEpisodes(season.id)
                return [season, episodes]
            })
        )

        return new Map(entries)
    },

    async updateSeason(id, name, franchise, year) {
        if(!id?.trim()){
            throw new Error('Id season is required')
        } else if (!name?.trim()) {
            throw new Error('Name for the season is required')
        } else if (!franchise?.trim()) {
            throw new Error('Franchise for the season is required')
        } else if (!Number(year)) {
            throw new Error('Year for the season is required')
        }

        return await seasonApiClient.update({id, name,franchise,year})
    },

    async getAllSeasons(){
        return await seasonApiClient.getAllSeasons()
    },

    async getRankableSeasonsWithEpisodes() {
        const seasons = await this.getRankableSeasons()

        const entries = await Promise.all(
            seasons.map(async (season) => {
                const episodes = await episodeService.getEpisodes(season.id)
                return [season, episodes]
            })
        )

        return new Map(entries)
    },

}
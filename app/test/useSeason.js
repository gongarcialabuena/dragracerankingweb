import { useEffect, useState } from 'react'
import { seasonService } from '@/lib/services/seasonService'
import { episodeService } from '@/lib/services/episodeService'
import Dropdown from "./dropdownSeason";

export function useSeason() {
    const [seasonName, setSeasonName] = useState()
    const [franchise, setFranchise] = useState()
    const [seasonYear, setSeasonYear] = useState()
    const [seasons, setSeasons] = useState([])
    const [error, setError] = useState(null)
    const [episodes, setEpisodes] = useState([])
    const [titleEpisode, setTitleEpisode] = useState()


    const handleCreate = async () => {
        try {
            const data = await seasonService.createSeason(seasonName, franchise, seasonYear)
            handleGet()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleGet = async () => {
        try {
            const data = await seasonService.getAllSeasons()
            setSeasons([{ id: '', name: 'Select season', franchise: null, year: null}, ...data]);
        } catch (err) {
            setError(err.message)
        }
    }

    const handleGetEpisodes = async (seasonSelected) => {
        try {
            const res = await episodeService.getEpisodes(seasonSelected.id)
            setEpisodes(res)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleSetEpisode = async (seasonSelected) => {
        try {
            const res = await episodeService.createEpisode(seasonSelected.id, titleEpisode)
            handleGetEpisodes(seasonSelected)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDeleteLastEpisode = async (seasonSelected) => {
        try {
            const res = await episodeService.deleteLastEpisode(seasonSelected.id)
            handleGetEpisodes(seasonSelected)
        } catch (err) {
            setError(err.message)
        }
    }

    return{
        setSeasonName,
        setFranchise,
        setSeasonYear,
        handleCreate,
        seasons,
        handleGet,
        episodes,
        titleEpisode,
        setTitleEpisode,
        handleSetEpisode,
        handleGetEpisodes,
        handleDeleteLastEpisode
    }
}
import { useEffect, useState } from 'react'
import { supabaseStorageService } from '@/lib/services/supabaseStorageService'
import { wikiImgService} from '@/lib/services/wikiImgService'

export function useSupabaseStorage() {

    const handleDownload = async (name, season) => {
        if (!name || !season) return ''
        const urlQueenName = name.replace(/\s+/g, '')
        const imgBlob = await wikiImgService.getQueenImgWiki(urlQueenName, season)
        const imgPath = await supabaseStorageService.uploadImgQueen(season, urlQueenName, imgBlob)
        const imgUrl = await supabaseStorageService.getQueenImg(imgPath)
        return imgUrl
    };

    const handleDelete = async (name, season) => {
        if (!name || !season) return ''
        
        await supabaseStorageService.deleteImgQueen(name, season)

    }

    return {

        handleDownload,
        handleDelete
    }
}
import { useEffect, useState } from 'react'
import { dropboxService } from '@/lib/services/dropboxService'

export function useDropbox() {
    const [imgQueen, setImgQueen] = useState("");

    async function getImgLink(queen,season) {
        if (!queen || !season) return ''
        const data = await dropboxService.getQueenImg(queen, season)

        return data
    }

    return {
        imgQueen,
        getImgLink
    }
}
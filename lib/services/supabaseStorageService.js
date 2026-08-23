import { supabaseStorageAPIClient } from '../client/supabase_storage/supabaseStorageAPIClient'

export const supabaseStorageService = {
    async getQueenImg(path) {
        if (!path?.trim()) {
            throw new Error('Path for the queen`s image is required')
        }
        return await supabaseStorageAPIClient.getImg(path)
    },

    async uploadImgQueen(season, name, imgBlob){
        if (!season.franchise?.trim()) {
            throw new Error('Franchise for the queen`s season is required')
        } else if (!name?.trim()) {
            throw new Error('Name for the queen is required')
        }
        console.log('Uploading image for queen:', name, 'in franchise:', season.franchise)
        return await supabaseStorageAPIClient.uploadImg(season.franchise, name, imgBlob)
    },

    async deleteImgQueen(name, season){
        if (!season.franchise?.trim()) {
            throw new Error('Franchise for the queen`s season is required')
        } else if (!name?.trim()) {
            throw new Error('Name for the queen is required')
        }
        return await supabaseStorageAPIClient.deleteImgQueen(name, season.franchise)
    }
}
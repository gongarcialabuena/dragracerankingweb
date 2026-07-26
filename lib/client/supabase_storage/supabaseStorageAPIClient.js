export const supabaseStorageAPIClient = {
    getImg: async (path) => {
        const res = await fetch(`api/supabase_storage?path=${encodeURIComponent(path)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error fetching queen img')
        return res.json()
    },

    uploadImg: async (franchise, name, imgBlob) => {
        const formData = new FormData()
        formData.append('franchise', franchise)
        formData.append('name', name)
        formData.append('file', imgBlob)
        
        const res = await fetch('/api/supabase_storage', {
            method: 'POST',
            body: formData
        })

        if (!res.ok) throw new Error('Error uploading queen img')
        return res.json()
    },

    deleteImgQueen: async(name, franchise) => {
        const path = `${franchise}/${name}CastMug.jpg`
        const res = await fetch(`api/supabase_storage?path=${encodeURIComponent(path)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })   
        if (!res.ok) throw new Error('Error uploading queen img')
        return res.json()
    }
}
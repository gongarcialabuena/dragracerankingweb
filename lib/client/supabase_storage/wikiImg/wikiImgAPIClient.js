export const wikiImgAPIClient = {
    getImgWiki: async (franchise, fileName) => {
        const res = await fetch(`/api/supabase_storage/wikiImg?franchise=${encodeURIComponent(franchise)}&name=${encodeURIComponent(fileName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error fetching queen img')
        return res.blob()
    }
}
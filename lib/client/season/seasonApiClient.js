export const seasonApiClient = {
    create: async (data) => {
        const res = await fetch('/api/season', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error('Error creating season')
        return res.json()
    },

    getAllSeasons: async () => {
        const res = await fetch('/api/season', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    }
}
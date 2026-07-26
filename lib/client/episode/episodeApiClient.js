export const episodeApiClient = {
    create: async (data) => {
        const res = await fetch('/api/episode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!res.ok) throw new Error('Error creating episode')
        return res.json()
    },

    get: async (season) => {
        const res = await fetch(`/api/episode?season=${encodeURIComponent(season)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error creating episode')
        return res.json()
    },

    deleteLast: async (season) => {
        const res = await fetch(`/api/episode?season=${encodeURIComponent(season)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error creating episode')
        return res.json()
    }
}
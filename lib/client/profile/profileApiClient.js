export const profileApiClient = {
    get: async () => {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting profile data')
        return res.json()
    },

    getAll: async () => {
        const res = await fetch('/api/profile/admin', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting profile data')
        return res.json()
    }
}
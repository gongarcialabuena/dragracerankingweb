export const participateApiClient = {
    create: async (data) => {
        const res = await fetch('/api/participate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Error creating season')
        return res.json()
    },

    getAll: async () => {
        const res = await fetch('/api/participate')
        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    },

    delete: async (data) => {
        const res = await fetch('/api/participate', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Error fetching seasons')
        return res.json()
    }
}
export const pointtypeApiClient = {
    getAll: async () => {
        const res = await fetch('/api/pointtype', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) throw new Error('Error creating episode')
        return res.json()
    },
}
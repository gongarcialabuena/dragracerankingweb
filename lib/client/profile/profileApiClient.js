export const profileApiClient = {
    get: async () => {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(res)
        if (!res.ok) throw new Error('Error getting profile data')
        return res.json()
    },
}
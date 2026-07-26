export const ppeApiClient = {
    saveRanking: async (rows) => {
        const res = await fetch('/api/ppe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rows),
        });

        if (!res.ok) {
            console.error(data);
            throw new Error(data.error ?? 'Error saving ranking');
        }

        return res.json();
    },

    deleteRowsRanking: async (rowsToDelete) => {
        const res = await fetch('/api/ppe', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowsToDelete),
        });

        if (!res.ok) {
            console.error(data);
            throw new Error(data.error ?? 'Error saving ranking');
        }

        return res.json();
    },

    getRanking: async (clientId, seasonId) => {
        const res = await fetch(`/api/ppe?clientId=${encodeURIComponent(clientId)}&seasonId=${encodeURIComponent(seasonId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting ranking')
        return res.json()
    },
}
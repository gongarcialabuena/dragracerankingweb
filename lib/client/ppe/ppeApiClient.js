export const ppeApiClient = {
    saveRanking: async ({ season_id, rows }) => {
        const res = await fetch('/api/ppe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                season_id,
                rows
            }),
        });

        const data = await res.json()

        if (!res.ok) {
            console.error(data);
            throw new Error(data.error ?? 'Error saving ranking');
        }

        return data;
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

    getRanking: async (seasonId) => {
        const res = await fetch(`/api/ppe?seasonId=${encodeURIComponent(seasonId)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Error getting ranking')
        return res.json()
    },

    publishRanking: async (seasonId) => {
        const res = await fetch('/api/ppe_reference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({seasonId}),
        });

        if (!res.ok) {
            console.error(data);
            throw new Error(data.error ?? 'Error publishing ranking');
        }

        return res.json();
    }
}
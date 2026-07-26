export const queenApiClient = {
  get: async (season = null, page) => {
    const url = new URL('/api/queen', window.location.origin)
    if (season && season.id) {
      url.searchParams.append('seasonId', season.id)
    }
    url.searchParams.append('page', page)
    
    const res = await fetch(url, {
      method: 'GET'
    })

    // Generar con el path los links temporales de todas las imagenes


    if (!res.ok) throw new Error('Error fetching queens')
    return res.json()
  },

  create: async (data) => {
    const res = await fetch('/api/queen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error('Error creating queen')
    return res.json()
  },

  remove: async (id) => {
    const res = await fetch('/api/queen', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (!res.ok) throw new Error('Error deleting queen')
    return res.json()
  },
  
  existsQueen: async (queenName) => {
    const res = await fetch(`api/queen/exists?name=${encodeURIComponent(queenName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) throw new Error('Error deleting queen')
    return res.json()
  }
}
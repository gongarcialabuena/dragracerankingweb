export const dropboxApiClient = {
  getQueenImg: async (queen, season) => {
    const dropboxQueenName = queen.name.replace(/\s+/g, '')
    const res = await fetch(`/api/dropbox/queen?queen=${encodeURIComponent(dropboxQueenName)}&season=${encodeURIComponent(season.franchise)}`);

    if (!res.ok) {
      throw new Error("Error fetching queen image");
    }

    const data = await res.json();
    return data.link;
  }
};